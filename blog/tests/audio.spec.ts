import { test, expect } from "@playwright/test";

type AudioEvent = { action: "start" | "stop" | "suspend"; duration?: number; loop?: boolean };
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

test("recorded ambience and menu cues only play after sound is enabled", async ({ page }) => {
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
      page.evaluate(() =>
        window.consoleAudioEvents.some((event) => event.action === "start" && event.loop),
      ),
    )
    .toBe(true);
  await page.keyboard.press("ArrowDown");
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.consoleAudioEvents.some(
          (event) =>
            event.action === "start" &&
            !event.loop &&
            Math.abs((event.duration ?? 0) - 0.42) < 0.06,
        ),
      ),
    )
    .toBe(true);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.consoleAudioEvents.some(
          (event) =>
            event.action === "start" && !event.loop && Math.abs((event.duration ?? 0) - 0.8) < 0.06,
        ),
      ),
    )
    .toBe(true);
  await page.keyboard.press("Escape");
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.consoleAudioEvents.some(
          (event) =>
            event.action === "start" &&
            !event.loop &&
            Math.abs((event.duration ?? 0) - 0.65) < 0.06,
        ),
      ),
    )
    .toBe(true);
  await page.getByRole("button", { name: "Turn sound off" }).click();
  await expect
    .poll(() =>
      page.evaluate(() => window.consoleAudioEvents.some((event) => event.action === "suspend")),
    )
    .toBe(true);
});

test("startup supports sound, keyboard focus, and immediate skipping", async ({ page }) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog", { name: "System startup" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Turn sound on" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.consoleAudioEvents.some(
          (event) => event.action === "start" && (event.duration ?? 0) > 6,
        ),
      ),
    )
    .toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("link", { name: "About", exact: true })).toBeFocused();
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.consoleAudioEvents.some(
          (event) => event.action === "stop" && (event.duration ?? 0) > 6,
        ),
      ),
    )
    .toBe(true);
});
