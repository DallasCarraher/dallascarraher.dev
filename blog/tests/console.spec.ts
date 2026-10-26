import { test, expect, type Page } from "@playwright/test";

async function skipBoot(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem("dc-booted", "1"));
}

test("startup can be skipped and stays skipped for this session", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Enter without sound" }).click();
  await expect(page.getByRole("dialog", { name: "System startup" })).toBeVisible();
  await page.getByRole("button", { name: "Skip intro" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "About", exact: true })).toBeFocused();
  await page.reload();
  await expect(page.getByRole("link", { name: "About", exact: true })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("keyboard navigation, focus restoration, and history", async ({ page }) => {
  await skipBoot(page);
  await page.goto("/");
  await expect(page.getByRole("link", { name: "About", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(page.getByRole("link", { name: "Contact", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { level: 1, name: "Projects" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("link", { name: "Projects", exact: true })).toBeFocused();
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1, name: "Projects" })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole("navigation")).toBeVisible();
});

test("all destinations support direct loads and reloads", async ({ page }) => {
  await page.route("**/api/spotify/token", (route) =>
    route.fulfill({ json: { access_token: "test", expires_in: 3600 } }),
  );
  await page.route("**/api/spotify/currently-playing?*", (route) => route.fulfill({ json: null }));
  for (const [path, title] of [
    ["about", "About me"],
    ["projects", "Projects"],
    ["blog", "Blog"],
    ["now-playing", "Now playing"],
    ["contact", "Stay connected"],
  ]) {
    await page.goto(`/${path}`);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});

test("sound preference persists and can be disabled", async ({ page }) => {
  await skipBoot(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect(page.getByRole("button", { name: "Turn sound off" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.reload();
  await page.getByRole("button", { name: "Turn sound off" }).click();
  await expect(page.getByRole("button", { name: "Turn sound on" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});

test("reduced motion bypasses startup and disables CSS animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Enter without sound" }).click();
  await expect(page.getByRole("link", { name: "About", exact: true })).toBeFocused();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(
    await page.locator(".screen-transition").evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});

test("navigation survives unavailable canvas", async ({ page }) => {
  await skipBoot(page);
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await page.goto("/");
  await page.getByRole("link", { name: "Blog", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No posts yet" })).toBeVisible();
});

for (const state of ["playing", "paused", "podcast", "idle", "error"] as const) {
  test(`Spotify ${state} state`, async ({ page }) => {
    await page.route("**/api/spotify/token", (route) =>
      route.fulfill({ json: { access_token: "test", expires_in: 3600 } }),
    );
    await page.route("**/api/spotify/currently-playing?*", (route) => {
      if (state === "error") return route.fulfill({ status: 503, json: { error: "Unavailable" } });
      return route.fulfill({
        json:
          state === "idle"
            ? null
            : {
                is_playing: state !== "paused",
                currently_playing_type: state === "podcast" ? "episode" : "track",
                progress_ms: 0,
                item: {
                  name: "Test audio",
                  duration_ms: 180000,
                  artists: [{ name: "Test artist" }],
                  show: { name: "Test podcast" },
                  external_urls: { spotify: "https://open.spotify.com/" },
                },
              },
      });
    });
    await page.goto("/now-playing");
    if (state === "idle")
      await expect(page.getByRole("heading", { name: "Nothing playing" })).toBeVisible();
    else if (state === "error")
      await expect(page.getByRole("heading", { name: "A little quiet right now" })).toBeVisible();
    else {
      await expect(page.getByRole("heading", { name: "Test audio" })).toBeVisible();
      await expect(page.getByText("0:00", { exact: true })).toBeVisible();
      await expect(page.getByRole("status")).toContainText(
        state === "paused" ? "PAUSED" : "PLAYING",
      );
      if (state === "podcast") await expect(page.getByText("Test podcast")).toBeVisible();
    }
  });
}

test("Spotify shows loading and stops polling after leaving the screen", async ({ page }) => {
  let requests = 0;
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/spotify/token", async (route) => {
    await gate;
    await route.fulfill({ json: { access_token: "test", expires_in: 3600 } });
  });
  await page.route("**/api/spotify/currently-playing?*", (route) => {
    requests++;
    return route.fulfill({ json: null });
  });
  await page.goto("/now-playing");
  await expect(page.getByText("Finding the frequency…")).toBeVisible();
  release();
  await expect(page.getByRole("heading", { name: "Nothing playing" })).toBeVisible();
  await page.getByRole("link", { name: "Back", exact: false }).click();
  const before = requests;
  await page.clock.install();
  await page.clock.fastForward(6000);
  expect(requests).toBe(before);
});

test("content works without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5173/");
  await page.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Stay connected" })).toBeVisible();
  await context.close();
});

test("landscape viewport keeps content within the page", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/contact");
  await expect(page.getByRole("heading", { name: "Stay connected" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("link", { name: "Back", exact: false }).click();
  await expect(page.getByRole("navigation")).toBeVisible();
});

for (const viewport of [
  { width: 390, height: 664 },
  { width: 320, height: 568 },
  { width: 844, height: 390 },
]) {
  test(`subpage controls stay visible at ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.route("**/api/spotify/token", (route) =>
      route.fulfill({ json: { access_token: "test", expires_in: 3600 } }),
    );
    await page.route("**/api/spotify/currently-playing?*", (route) =>
      route.fulfill({ json: null }),
    );
    for (const path of ["about", "projects", "blog", "now-playing", "contact"]) {
      await page.goto(`/${path}`);
      const back = page.getByRole("link", { name: "Back", exact: true });
      await expect(back).toBeInViewport({ ratio: 1 });
      await expect(page.getByRole("button", { name: "Replay intro" })).toHaveCount(0);
      await expect(page.locator(".sound-control")).toBeInViewport({ ratio: 1 });
      const stage = page.locator(".console-stage");
      await stage.evaluate((el) => el.scrollTo(0, el.scrollHeight));
      await expect(page.locator(".content-page > :last-child")).toBeInViewport({ ratio: 1 });
      await expect(back).toBeInViewport({ ratio: 1 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    await page.getByRole("link", { name: "Back", exact: true }).click();
    await expect(page.getByRole("navigation")).toBeVisible();
  });
}
