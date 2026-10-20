import { test, expect } from "@playwright/test";

type AudioEvent = {
  action: "start" | "stop" | "suspend";
  duration?: number;
  loop?: boolean;
  offset?: number;
};
declare global {
  interface Window {
    consoleAudioEvents: AudioEvent[];
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.consoleAudioEvents = [];
    const Original = window.AudioContext;
    window.AudioContext = class extends Original {
      createBufferSource() {
        const source = super.createBufferSource();
        const start = source.start.bind(source);
        const stop = source.stop.bind(source);
        source.start = (...args) => {
          window.consoleAudioEvents.push({
            action: "start",
            duration: source.buffer?.duration,
            loop: source.loop,
            offset: args[1] ?? 0,
          });
          start(...args);
        };
        source.stop = (...args) => {
          window.consoleAudioEvents.push({ action: "stop", duration: source.buffer?.duration });
          stop(...args);
        };
        return source;
      }
      suspend() {
        window.consoleAudioEvents.push({ action: "suspend" });
        return super.suspend();
      }
    };
  });
});

const starts = (events: AudioEvent[]) => events.filter((e) => e.action === "start");

test("menu sounds are opt-in one-shots with no ambience requests", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/audio/")) requests.push(request.url());
  });
  await page.addInitScript(() => sessionStorage.setItem("dc-booted", "1"));
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Turn sound on" })).toBeEnabled();
  expect(requests).toHaveLength(0);
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect.poll(() => requests.length).toBe(4);
  expect(await page.evaluate(() => window.consoleAudioEvents)).toHaveLength(0);
  await page.keyboard.press("ArrowDown");
  await expect
    .poll(async () => starts(await page.evaluate(() => window.consoleAudioEvents)).length)
    .toBe(1);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();
  await expect
    .poll(async () => starts(await page.evaluate(() => window.consoleAudioEvents)).length)
    .toBe(2);
  await page.keyboard.press("Escape");
  await expect
    .poll(async () => starts(await page.evaluate(() => window.consoleAudioEvents)).length)
    .toBe(3);
  expect(
    starts(await page.evaluate(() => window.consoleAudioEvents)).every((event) => !event.loop),
  ).toBe(true);
  expect(requests.some((url) => url.includes("ambience"))).toBe(false);
  await page.getByRole("button", { name: "Turn sound off" }).click();
  await expect
    .poll(() =>
      page.evaluate(() => window.consoleAudioEvents.some((event) => event.action === "suspend")),
    )
    .toBe(true);
});

test("entry waits for a choice, silent entry fetches no audio, and replay works twice", async ({
  page,
}, testInfo) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/audio/")) requests.push(request.url());
  });
  await page.goto("/");
  const entry = page.getByRole("dialog", { name: "Dallas Carraher" });
  await expect(entry).toBeVisible();
  await expect(entry.getByRole("button", { name: "Enter with sound" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(entry.getByRole("button", { name: "Enter without sound" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(entry.getByRole("button", { name: "Enter with sound" })).toBeFocused();
  await expect(page.locator(".startup-scene")).toHaveCount(0);
  expect(requests).toHaveLength(0);
  await page.getByRole("button", { name: "Enter without sound" }).click();
  const intro = page.getByRole("dialog", { name: "System startup" });
  await expect(intro).toBeVisible();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: testInfo.outputPath("startup-towers.png") });
  await page.getByRole("button", { name: "Skip intro" }).click();
  for (let i = 0; i < 2; i++) {
    await page.getByRole("button", { name: "Replay intro" }).click();
    await expect(intro).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(intro).toHaveCount(0);
  }
  expect(requests).toHaveLength(0);
});

test("sound starts once from the beginning, ends naturally, and replay replaces it", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Enter with sound" }).click();
  const intro = page.getByRole("dialog", { name: "System startup" });
  await expect(intro).toBeVisible();
  await expect
    .poll(async () => starts(await page.evaluate(() => window.consoleAudioEvents)).length)
    .toBe(1);
  const events = await page.evaluate(() => window.consoleAudioEvents);
  expect(starts(events)[0].duration).toBeGreaterThan(10);
  expect(starts(events)[0].loop).toBe(false);
  expect(starts(events)[0].offset).toBe(0);
  await expect(intro).toHaveCount(0, { timeout: 9000 });
  // The full original reverb tail may finish over the menu, without restarting.
  expect(starts(await page.evaluate(() => window.consoleAudioEvents))).toHaveLength(1);
  await page.getByRole("button", { name: "Replay intro" }).click();
  await expect(intro).toBeVisible();
  await expect
    .poll(async () => starts(await page.evaluate(() => window.consoleAudioEvents)).length)
    .toBe(2);
  await page.keyboard.press("Escape");
  await expect(intro).toHaveCount(0);
  await expect(page.getByRole("link", { name: "About", exact: true })).toBeFocused();
  expect(
    (await page.evaluate(() => window.consoleAudioEvents)).some(
      (e) => e.action === "stop" && (e.duration ?? 0) > 10,
    ),
  ).toBe(true);
});

test("slow startup audio waits before imagery and can be cancelled for silent entry", async ({
  page,
}) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/audio/startup.mp3", async (route) => {
    await held;
    await route.continue();
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Enter with sound" }).click();
  await expect(page.getByRole("button", { name: "Loading startup…" })).toBeDisabled();
  await expect(page.locator(".startup-scene")).toHaveCount(0);
  await page.getByRole("button", { name: "Enter without sound" }).click();
  await expect(page.getByRole("dialog", { name: "System startup" })).toBeVisible();
  release();
  await page.getByRole("button", { name: "Skip intro" }).click();
  expect(starts(await page.evaluate(() => window.consoleAudioEvents))).toHaveLength(0);
});

test("failed audio still allows entry", async ({ page }) => {
  await page.route("**/audio/startup.mp3", (route) =>
    route.fulfill({ status: 404, body: "Unavailable" }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Enter with sound" }).click();
  await expect(page.getByRole("dialog", { name: "System startup" })).toBeVisible();
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(page.getByRole("button", { name: "Replay intro" })).toBeVisible();
  expect(starts(await page.evaluate(() => window.consoleAudioEvents))).toHaveLength(0);
});

test("muting stops the intro sound and turning sound back on does not restart it", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Enter with sound" }).click();
  const intro = page.getByRole("dialog", { name: "System startup" });
  await expect
    .poll(async () => starts(await page.evaluate(() => window.consoleAudioEvents)).length)
    .toBe(1);
  await intro.getByRole("button", { name: "Turn sound off" }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.consoleAudioEvents.some((e) => e.action === "stop" && (e.duration ?? 0) > 10),
      ),
    )
    .toBe(true);
  await intro.getByRole("button", { name: "Turn sound on" }).click();
  await page.getByRole("button", { name: "Skip intro" }).click();
  expect(starts(await page.evaluate(() => window.consoleAudioEvents))).toHaveLength(1);
});
