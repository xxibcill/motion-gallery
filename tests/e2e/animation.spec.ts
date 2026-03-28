import { test, expect } from "@playwright/test";

test.describe("Animation Pages", () => {
  test("should render GSAP animation page", async ({ page }) => {
    await page.goto("/gsap");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should render scroll expand grid page", async ({ page }) => {
    await page.goto("/scroll-expand-grid");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should render combined animation page", async ({ page }) => {
    await page.goto("/combined-animation");
    await expect(page.locator("body")).toBeVisible();
  });

  test("should render transition lab landing", async ({ page }) => {
    await page.goto("/transition");
    await expect(page.locator("body")).toBeVisible();
  });

  test("animation pages should have consistent layout", async ({ page }) => {
    await page.goto("/gsap");
    // Check that main content area exists
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });
});
