import { test as base, expect } from "@playwright/test";

// Extend base test with custom fixtures if needed
export const test = base.extend({});

export { expect };

// Reusable test utilities
export const waitForAnimation = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));
