import { test, expect, type Page } from "@playwright/test";

const code = [
  "ArrowUp",
  "ArrowUp",
  "ArrowUp",
  "ArrowLeft",
  "ArrowDown",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowUp",
  "ArrowUp",
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
];
const disc = (page: Page) => page.getByRole("button", { name: "Spin Jak and Daxter disc" });
const rotation = (page: Page) =>
  disc(page).evaluate(
    (el) => parseFloat((el as HTMLElement).style.getPropertyValue("--disc-rotation")) || 0,
  );

async function unlock(page: Page) {
  for (const key of code) await page.keyboard.press(key);
  await expect(disc(page)).toBeFocused();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("dc-booted", "1"));
  await page.goto("/");
  await expect(page.getByRole("link", { name: "About", exact: true })).toBeFocused();
});

test("only the full sequence replaces the menu, and Back restores it", async ({ page }) => {
  for (const key of [...code.slice(0, 8), "x", ...code.slice(8)]) await page.keyboard.press(key);
  await expect(disc(page)).toHaveCount(0);
  await unlock(page);
  await expect(page.getByRole("navigation")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Select a disc" })).toBeVisible();
  await expect
    .poll(() =>
      disc(page)
        .locator("img")
        .evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth === 1280),
    )
    .toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `/tmp/disc-selector-${test.info().project.name}.png` });
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.locator(".menu-link[aria-current]")).toBeFocused();
  await unlock(page);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation")).toBeVisible();
});

test("dragging rotates the disc, a flick coasts, and grabbing stops it", async ({ page }) => {
  await unlock(page);
  const bounds = (await disc(page).boundingBox())!;
  const cx = bounds.x + bounds.width / 2;
  const cy = bounds.y + bounds.height / 2;
  const r = bounds.width * 0.35;
  await page.mouse.move(cx + r, cy);
  await page.mouse.down();
  await page.mouse.move(cx, cy + r, { steps: 8 });
  expect(await rotation(page)).toBeCloseTo(90, 0);
  await page.mouse.up();
  const released = await rotation(page);
  await expect.poll(() => rotation(page)).toBeGreaterThan(released + 5);
  await page.mouse.move(cx + r, cy);
  await page.mouse.down();
  const stopped = await rotation(page);
  await page.waitForTimeout(150);
  expect(await rotation(page)).toBe(stopped);
  await page.mouse.up();
});

test("touch dragging works with pointer capture", async ({ page, context }) => {
  await unlock(page);
  const bounds = (await disc(page).boundingBox())!;
  const cx = bounds.x + bounds.width / 2;
  const cy = bounds.y + bounds.height / 2;
  const r = bounds.width * 0.35;
  const session = await context.newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: cx + r, y: cy }],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: cx, y: cy + r }],
  });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => rotation(page)).toBeGreaterThanOrEqual(89);
  await expect(disc(page)).not.toHaveAttribute("data-dragging");
});

test("keyboard spinning respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await unlock(page);
  await page.keyboard.press("ArrowRight");
  expect(await rotation(page)).toBe(30);
  await page.keyboard.press("ArrowLeft");
  expect(await rotation(page)).toBe(0);
  await page.keyboard.press("Enter");
  expect(await rotation(page)).toBe(30);
  await page.waitForTimeout(150);
  expect(await rotation(page)).toBe(30);
});
