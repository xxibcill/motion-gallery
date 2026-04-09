import { test, expect } from "@playwright/test";
import { getTransitionLabAnimations } from "@/tests/fixtures/route-inventory";

test.describe("Transition Lab Routes", () => {
  const transitionRoutes = getTransitionLabAnimations().map(
    (animation) => animation.path
  );

  test.describe("Smoke Tests", () => {
    for (const route of transitionRoutes) {
      test(`[${route}] page loads and body is visible`, async ({ page }) => {
        await page.goto(route);
        await expect(page.locator("body")).toBeVisible();
      });
    }
  });
});
