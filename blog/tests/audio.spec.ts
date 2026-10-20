import { test, expect } from "@playwright/test";

type AudioEvent = {
  action: "start" | "stop" | "suspend" | "ramp";
  when?: number;
  observedAt?: number;
  value?: number;
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
            when: this.currentTime,
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
      createGain() {
        const gain = super.createGain();
        const ramp = gain.gain.linearRampToValueAtTime.bind(gain.gain);
        gain.gain.linearRampToValueAtTime = (value, when) => {
          window.consoleAudioEvents.push({
            action: "ramp",
            value,
            when,
            observedAt: this.currentTime,
          });
          return ramp(value, when);
        };
        return gain;
      }
      suspend() {
        window.consoleAudioEvents.push({ action: "suspend" });
        return super.suspend();
      }
    };
  });
});

const starts = (events: AudioEvent[]) => events.filter((e) => e.action === "start" && !e.loop);

test("menu sound is opt-in, continuous across routes, and separate from one-shot cues", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/audio/")) requests.push(request.url());
  });
  await page.addInitScript(() => sessionStorage.setItem("dc-booted", "1"));
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Turn sound on" })).toBeEnabled();
  expect(requests).toHaveLength(0);
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect.poll(() => requests.length).toBe(5);
  await expect
    .poll(() =>
      page.evaluate(
        () => window.consoleAudioEvents.filter((e) => e.action === "start" && e.loop).length,
      ),
    )
    .toBe(1);
  expect(starts(await page.evaluate(() => window.consoleAudioEvents))).toHaveLength(0);
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
  const bed = (await page.evaluate(() => window.consoleAudioEvents)).filter(
    (e) => e.action === "start" && e.loop,
  );
  expect(bed).toHaveLength(1);
  expect(bed[0].duration).toBeCloseTo(112, 1);
  expect(requests.filter((url) => url.includes("ambience"))).toHaveLength(1);
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
  // The waves fade in before the complete startup recording's reverb tail ends.
  await expect
    .poll(() =>
      page.evaluate(
        () => window.consoleAudioEvents.filter((e) => e.action === "start" && e.loop).length,
      ),
    )
    .toBe(1);
  const transition = await page.evaluate(() => window.consoleAudioEvents);
  const waves = transition.find((e) => e.action === "start" && e.loop)!;
  expect(waves.duration).toBeCloseTo(112, 1);
  const delta = waves.when! - starts(transition)[0].when!;
  expect(delta).toBeGreaterThan(5);
  expect(delta).toBeLessThan(starts(transition)[0].duration!);
  const fade = transition.find((e) => e.action === "ramp")!;
  expect(fade.when! - fade.observedAt!).toBeCloseTo(3, 1);
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

test("muting during a slow ambience fetch prevents late background playback", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("dc-booted", "1"));
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/audio/ambience.mp3", async (route) => {
    await held;
    await route.continue();
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await page.getByRole("button", { name: "Turn sound off" }).click();
  release();
  await page.getByRole("link", { name: "About", exact: true }).click();
  expect(
    (await page.evaluate(() => window.consoleAudioEvents)).filter((e) => e.action === "start"),
  ).toHaveLength(0);
});

test("background waves pause when hidden and resume once when visible", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("dc-booted", "1"));
  await page.goto("/");
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () => window.consoleAudioEvents.filter((e) => e.action === "start" && e.loop).length,
      ),
    )
    .toBe(1);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.consoleAudioEvents.some((e) => e.action === "stop" && (e.duration ?? 0) > 100),
      ),
    )
    .toBe(true);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    document.dispatchEvent(new Event("visibilitychange"));
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() =>
      page.evaluate(
        () => window.consoleAudioEvents.filter((e) => e.action === "start" && e.loop).length,
      ),
    )
    .toBe(2);
  await page.getByRole("button", { name: "Turn sound off" }).click();
  expect(
    (await page.evaluate(() => window.consoleAudioEvents)).filter(
      (e) => e.action === "stop" && (e.duration ?? 0) > 100,
    ),
  ).toHaveLength(2);
});
