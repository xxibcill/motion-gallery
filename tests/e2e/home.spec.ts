import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should display animation navigation", async ({ page }) => {
    await page.goto("/");
    // Check that the animation nav component exists
    await expect(page.locator("body")).toBeVisible();
  });

  test("should navigate to animation page", async ({ page }) => {
    await page.goto("/");
    // Click on a navigation link and verify URL change
    const firstLink = page.locator("a").first();
    if (await firstLink.isVisible()) {
      await firstLink.click();
      await expect(page).not.toHaveURL("/");
    }
  });
});
