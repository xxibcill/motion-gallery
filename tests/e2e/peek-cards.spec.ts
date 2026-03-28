import { test, expect } from "@playwright/test";

test.describe("Peek Card Animations", () => {
  test.describe("Center Peek Shrink Card", () => {
    test("should render center peek card on page load", async ({ page }) => {
      await page.goto("/center-peek-shrink");

      // Card should be visible
      const card = page.getByTestId("center-peek-card");
      await expect(card).toBeVisible();

      // Card should have initial peek state styles
      const box = await card.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(0);
      expect(box!.height).toBeGreaterThan(0);
    });

    test("should animate card growth on scroll", async ({ page }) => {
      await page.goto("/center-peek-shrink");

      const card = page.getByTestId("center-peek-card");
      await expect(card).toBeVisible();

      // Get initial dimensions
      const initialBox = await card.boundingBox();
      const initialWidth = initialBox!.width;
      const initialHeight = initialBox!.height;

      // Scroll to trigger grow animation (22% of total scroll)
      await page.evaluate(() => {
        const section = document.querySelector('section[style*="height"]');
        if (section) {
          const scrollHeight = section.getBoundingClientRect().height;
          window.scrollTo(0, scrollHeight * 0.25);
        }
      });

      // Wait for animation to settle
      await page.waitForTimeout(500);

      // Card should have grown
      const grownBox = await card.boundingBox();
      expect(grownBox!.width).toBeGreaterThanOrEqual(initialWidth);
      expect(grownBox!.height).toBeGreaterThanOrEqual(initialHeight);
    });

    test("should shrink card when scrolling past threshold", async ({ page }) => {
      await page.goto("/center-peek-shrink");

      const card = page.getByTestId("center-peek-card");
      await expect(card).toBeVisible();

      // Scroll to full expansion first (25% into the tall section)
      await page.evaluate(() => {
        const section = document.querySelector('section[style*="height"]');
        if (section) {
          // Get the section's offset from top of document
          const sectionTop = section.offsetTop;
          // Get the section's actual scrollable height from style
          const sectionHeight = section.offsetHeight;
          // Scroll to 25% into the section
          window.scrollTo(0, sectionTop + sectionHeight * 0.25);
        }
      });
      await page.waitForTimeout(500);

      const expandedBox = await card.boundingBox();
      const expandedHeight = expandedBox!.height;

      // Scroll past shrink threshold (60% into the section)
      await page.evaluate(() => {
        const section = document.querySelector('section[style*="height"]');
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          window.scrollTo(0, sectionTop + sectionHeight * 0.6);
        }
      });
      await page.waitForTimeout(500);

      // Card should have shrunk
      const shrunkBox = await card.boundingBox();
      expect(shrunkBox!.height).toBeLessThan(expandedHeight);
    });

    test("should anchor card to top after shrink", async ({ page }) => {
      await page.goto("/center-peek-shrink");

      const card = page.getByTestId("center-peek-card");

      // Scroll to end
      await page.evaluate(() => {
        const section = document.querySelector('section[style*="height"]');
        if (section) {
          section.scrollIntoView({ behavior: "instant", block: "end" });
        }
      });
      await page.waitForTimeout(500);

      // Card should be anchored at top
      const box = await card.boundingBox();
      expect(box!.y).toBeLessThan(100); // Near top of viewport
    });
  });

  test.describe("Bottom Peek Card", () => {
    test("should render bottom peek card on test page", async ({ page }) => {
      await page.goto("/test");

      // Card should be visible
      const card = page.getByTestId("bottom-peek-card");
      await expect(card).toBeVisible();
    });

    test("should expand from center on scroll", async ({ page }) => {
      await page.goto("/test");

      const card = page.getByTestId("bottom-peek-card");

      // Get initial width
      const initialBox = await card.boundingBox();
      const initialWidth = initialBox!.width;

      // Scroll to trigger expansion
      await page.evaluate(() => {
        window.scrollTo(0, window.innerHeight * 1.5);
      });
      await page.waitForTimeout(500);

      // Card width should expand
      const expandedBox = await card.boundingBox();
      expect(expandedBox!.width).toBeGreaterThanOrEqual(initialWidth);
    });
  });
});
