import { test, expect } from "@playwright/test";
import { getCoreRoutes } from "@/tests/fixtures/route-inventory";

test.describe("Core Gallery Routes", () => {
  const coreRoutes = getCoreRoutes();

  test.describe("Smoke Tests", () => {
    for (const route of coreRoutes) {
      test(`[${route}] page loads and body is visible`, async ({ page }) => {
        await page.goto(route);
        await expect(page.locator("body")).toBeVisible();
      });
    }
  });
});