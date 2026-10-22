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
  await expect(
    page.getByRole("button", { name: "Open Jak and Daxter case", exact: true }),
  ).toBeFocused();
}

async function openDisc(page: Page) {
  await unlock(page);
  await page.getByRole("button", { name: "Open case", exact: true }).click();
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
  await expect(page.getByRole("heading", { name: "Pick something good." })).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".is-selected .case-front img")
        .evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0),
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
  await openDisc(page);
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
  await openDisc(page);
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
  await openDisc(page);
  await page.keyboard.press("ArrowRight");
  expect(await rotation(page)).toBe(30);
  await page.keyboard.press("ArrowLeft");
  expect(await rotation(page)).toBe(0);
  await page.keyboard.press("Enter");
  expect(await rotation(page)).toBe(30);
  await page.waitForTimeout(150);
  expect(await rotation(page)).toBe(30);
});

test("cover flow browses games, flips a case, and opens the selected disc", async ({ page }) => {
  await unlock(page);
  await page.keyboard.press("ArrowRight");
  const jakII = page.getByRole("button", { name: "Open Jak II case", exact: true });
  await expect(jakII).toBeFocused();
  await expect(page.getByRole("heading", { name: "Jak II", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "View back", exact: true }).click();
  await expect(page.locator(".disc-selector")).toHaveClass(/case-is-flipped/);
  await page.getByRole("button", { name: "View front", exact: true }).click();
  await jakII.click();
  await expect(page.locator(".disc-selector")).toHaveClass(/collection-opening/);
  const selectedDisc = page.getByRole("button", { name: "Spin Jak II disc", exact: true });
  await expect(selectedDisc).toBeFocused();
  await expect(selectedDisc.locator("img")).toHaveAttribute("src", /jak-ii\/disc.webp/);
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(jakII).toBeFocused();
  await page.getByRole("button", { name: "Next game", exact: true }).click();
  await expect(page.getByRole("button", { name: "Open Jak 3 case", exact: true })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(
    page.getByRole("button", { name: "Open Jak and Daxter case", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("button", { name: "Open Jak 3 case", exact: true })).toBeFocused();
});

test("swiping changes the selection without opening a case", async ({
  page,
  context,
  isMobile,
}) => {
  await unlock(page);
  const bounds = (await page.locator(".cover-flow").boundingBox())!;
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  if (isMobile) {
    const session = await context.newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x - 65, y }],
    });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  } else {
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 65, y, { steps: 6 });
    await page.mouse.up();
  }
  await expect(page.getByRole("button", { name: "Open Jak II case", exact: true })).toBeFocused();
  await expect(page.locator(".disc-selector")).toHaveClass(/collection-browse/);
});

test("landscape collection and disc keep the footer in view", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await unlock(page);
  const fits = () =>
    page
      .locator(".system-footer")
      .evaluate((el) => el.getBoundingClientRect().bottom <= innerHeight + 1);
  expect(await fits()).toBe(true);
  await page.getByRole("button", { name: "Open case", exact: true }).click();
  await expect(disc(page)).toBeFocused();
  expect(await fits()).toBe(true);
});

test("Escape can interrupt case opening and restore collection focus", async ({ page }) => {
  await unlock(page);
  await page.keyboard.press("Enter");
  await expect(page.locator(".disc-selector")).toHaveClass(/collection-opening/);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open Jak and Daxter case", exact: true }),
  ).toBeFocused();
  await expect(disc(page)).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation")).toBeVisible();
});

test("mobile duck unlocks after five seconds and cancels an interrupted hold", async ({
  page,
  context,
  isMobile,
}) => {
  test.skip(!isMobile, "Touch shortcut is for mobile");
  const now = new Date();
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  const duck = page.getByRole("button", { name: "A little duck has something to say" });
  await expect(duck).toBeVisible();
  const bounds = (await duck.boundingBox())!;
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  const session = await context.newCDPSession(page);
  const start = () =>
    session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  const end = () => session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });

  await start();
  await page.clock.fastForward(4000);
  await end();
  await page.clock.fastForward(5000);
  await expect(disc(page)).toHaveCount(0);
  await expect(page.locator(".duck-greeting")).toBeVisible();

  await start();
  await session.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: x + 25, y }],
  });
  await page.clock.fastForward(5000);
  await expect(disc(page)).toHaveCount(0);
  await end();

  await start();
  await page.clock.fastForward(4999);
  await expect(disc(page)).toHaveCount(0);
  await page.clock.fastForward(1);
  await expect(
    page.getByRole("button", { name: "Open Jak and Daxter case", exact: true }),
  ).toBeFocused();
  await end();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.getByRole("navigation")).toBeVisible();

  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "About me", exact: true })).toBeFocused();
  const contentBounds = (await duck.boundingBox())!;
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [
      {
        x: contentBounds.x + contentBounds.width / 2,
        y: contentBounds.y + contentBounds.height / 2,
      },
    ],
  });
  await page.clock.fastForward(5000);
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("button", { name: "Open Jak and Daxter case", exact: true }),
  ).toBeVisible();
  await end();
});
