import { test, expect } from "@playwright/test";

test("debug initial render", async ({ page }) => {
  // Listen for console errors
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("/fear-greed-index");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);

  console.log("Console errors:", errors);

  // Check the body background
  const bodyBg = await page.evaluate(() => {
    return window.getComputedStyle(document.body).backgroundColor;
  });
  console.log("Body background:", bodyBg);

  // Check the scroll container's position relative to viewport
  const containerInfo = await page.evaluate(() => {
    const container = document.querySelector('[style*="600vh"]') as HTMLElement;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      bgColor: window.getComputedStyle(container).backgroundColor,
      childHTML: container.children[0]?.outerHTML?.substring(0, 500),
    };
  });
  console.log("Container info:", JSON.stringify(containerInfo, null, 2));

  // Check what the viewport actually shows
  const viewportContent = await page.evaluate(() => {
    // Check elements at viewport center
    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    return el ? {
      tag: el.tagName,
      text: el.textContent?.substring(0, 100),
      className: el.className,
      computedBg: window.getComputedStyle(el).backgroundColor,
    } : null;
  });
  console.log("Element at viewport center:", viewportContent);

  // Take screenshot with full page to see everything
  await page.screenshot({ path: "test-results/fear-greed-debug-fullpage.png", fullPage: false });

  // Try scrolling a tiny amount
  await page.evaluate(() => window.scrollTo({ top: 10, behavior: "instant" }));
  await page.waitForTimeout(300);
  await page.screenshot({ path: "test-results/fear-greed-debug-scrolled10.png", fullPage: false });
});
