import { test, expect, type Page } from "@playwright/test";
import { getClockOrbs } from "../app/components/console/clock";
import { readFileSync } from "node:fs";

const referenceFrames: { time: [number, number, number, number]; points: number[][] }[] =
  JSON.parse(readFileSync(new URL("./fixtures/clock-reference.json", import.meta.url), "utf8"));

// Fixtures calculated independently with the reference's row-major matrix chain.
// Source: imsaud.me, assets/index-CVD5AJ_P.js, PS2 clock-system animation.
for (const {
  time: [hours, minutes, seconds, milliseconds],
  points,
} of referenceFrames) {
  test(`clock matches reference at ${hours}:${minutes}:${seconds}.${milliseconds}`, () => {
    const actual = getClockOrbs(new Date(2026, 0, 2, hours, minutes, seconds, milliseconds));
    expect(actual).toHaveLength(7);
    actual.forEach((orb, i) => {
      expect(orb.x).toBeCloseTo(points[i][0], 10);
      expect(orb.y).toBeCloseTo(points[i][1], 10);
      expect(orb.z).toBeCloseTo(points[i][2], 10);
    });
  });
}

test("matches coordinates observed from the live reference", () => {
  // Sampled from the reference DOM at 11:43:55.422 PDT on 2026-10-20.
  // Its last animation frame was 11:43:55.404 (18ms before the DOM read).
  const observed = [
    [-63.722, -33.0028, -54.3168],
    [-73.2638, 8.73007, -51.5387],
    [-66.1861, 48.4712, -37.0148],
    [-44.1236, 77.1831, -14.0088],
    [-12.1152, 88.3338, 12.2881],
    [22.5399, 79.3818, 35.9372],
    [51.9417, 52.3527, 51.6013],
  ];
  const actual = getClockOrbs(new Date(2026, 9, 20, 11, 43, 55, 404));
  actual.forEach((orb, i) => {
    expect(orb.x * 90).toBeCloseTo(observed[i][0], 4);
    expect(orb.y * 90).toBeCloseTo(observed[i][1], 4);
    expect(orb.z * 90).toBeCloseTo(observed[i][2], 4);
  });
});

test("clock positions repeat after twelve hours", () => {
  const morning = getClockOrbs(new Date(2026, 0, 2, 7, 22, 34, 567));
  const evening = getClockOrbs(new Date(2026, 0, 2, 19, 22, 34, 567));
  morning.forEach((orb, i) => {
    expect(orb.x).toBeCloseTo(evening[i].x, 10);
    expect(orb.y).toBeCloseTo(evening[i].y, 10);
    expect(orb.z).toBeCloseTo(evening[i].z, 10);
  });
});

async function canvasPixels(page: Page) {
  const canvas = page.locator(".scene canvas");
  await expect
    .poll(() =>
      canvas.evaluate((el: HTMLCanvasElement) => {
        const ctx = el.getContext("2d");
        return ctx && ctx.getImageData(0, 0, el.width, el.height).data.some((value) => value > 0);
      }),
    )
    .toBe(true);
  return canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL());
}

test("particle glows fade beyond the layout box without hitting the canvas edge", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date(2026, 9, 20, 21, 4, 10));
  await page.addInitScript(() => sessionStorage.setItem("dc-booted", "1"));
  await page.goto("/");
  await canvasPixels(page);
  const pixels = await page.locator(".scene canvas").evaluate((el: HTMLCanvasElement) => {
    const { width, height } = el;
    const data = el.getContext("2d")!.getImageData(0, 0, width, height).data;
    let belowScene = false;
    let touchesEdge = false;
    const sceneBottom = Math.ceil((height * 5) / 6);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (!data[(y * width + x) * 4 + 3]) continue;
        if (y >= sceneBottom) belowScene = true;
        if (x === 0 || y === 0 || x === width - 1 || y === height - 1) touchesEdge = true;
      }
    }
    return { belowScene, touchesEdge };
  });
  expect(pixels.belowScene).toBe(true);
  expect(pixels.touchesEdge).toBe(false);
});

test("refresh keeps the same clock pattern instead of restarting a loop", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-10-20T19:22:34.567Z"));
  await page.addInitScript(() => sessionStorage.setItem("dc-booted", "1"));
  await page.goto("/");
  const before = await canvasPixels(page);
  await page.reload();
  expect(await canvasPixels(page)).toBe(before);
  await page.clock.setFixedTime(new Date("2026-10-20T19:22:35.567Z"));
  await expect.poll(() => canvasPixels(page)).not.toBe(before);
});

test("reduced motion freezes the clock scene and resumes at current time", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.setFixedTime(new Date("2026-10-20T19:22:34.567Z"));
  await page.goto("/");
  const before = await canvasPixels(page);
  await page.clock.setFixedTime(new Date("2026-10-20T19:22:45.567Z"));
  expect(await canvasPixels(page)).toBe(before);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect.poll(() => canvasPixels(page)).not.toBe(before);
});
