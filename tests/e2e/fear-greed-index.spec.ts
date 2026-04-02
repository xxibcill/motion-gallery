import { test, expect } from "@playwright/test";

test.describe("Fear & Greed Index", () => {
  test("scroll-driven gauge animation", async ({ page }) => {
    await page.goto("/fear-greed-index");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    // Phase 1: Initial state - title should be visible but content may be faded
    await page.screenshot({
      path: "test-results/fear-greed-00-initial.png",
      fullPage: false,
    });

    // Verify title exists
    const title = page.locator("h1");
    await expect(title).toContainText("Fear & Greed Index");

    // Phase 2: Scroll to gauge animation phase (~15% of total scroll)
    const scrollContainer = page.locator("div").first();
    await page.evaluate(() => {
      const container = document.querySelector('[style*="600vh"]') as HTMLElement;
      if (container) {
        const totalHeight = container.scrollHeight - window.innerHeight;
        window.scrollTo({ top: totalHeight * 0.15, behavior: "instant" });
      }
    });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: "test-results/fear-greed-01-gauge-animating.png",
      fullPage: false,
    });

    // Phase 3: Scroll to gauge complete (~30%)
    await page.evaluate(() => {
      const container = document.querySelector('[style*="600vh"]') as HTMLElement;
      if (container) {
        const totalHeight = container.scrollHeight - window.innerHeight;
        window.scrollTo({ top: totalHeight * 0.32, behavior: "instant" });
      }
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: "test-results/fear-greed-02-gauge-complete.png",
      fullPage: false,
    });

    // Phase 4: Scroll to cards revealed (~50%)
    await page.evaluate(() => {
      const container = document.querySelector('[style*="600vh"]') as HTMLElement;
      if (container) {
        const totalHeight = container.scrollHeight - window.innerHeight;
        window.scrollTo({ top: totalHeight * 0.50, behavior: "instant" });
      }
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: "test-results/fear-greed-03-cards-visible.png",
      fullPage: false,
    });

    // Verify crypto cards are visible
    const cards = page.locator("text=Bitcoin");
    await expect(cards).toBeVisible();

    // Phase 5: Full reveal (~70%)
    await page.evaluate(() => {
      const container = document.querySelector('[style*="600vh"]') as HTMLElement;
      if (container) {
        const totalHeight = container.scrollHeight - window.innerHeight;
        window.scrollTo({ top: totalHeight * 0.70, behavior: "instant" });
      }
    });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: "test-results/fear-greed-04-full-reveal.png",
      fullPage: false,
    });
  });
});
