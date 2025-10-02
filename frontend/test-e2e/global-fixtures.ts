// SPDX-License-Identifier: AGPL-3.0-or-later
import { test as base, expect as baseExpect } from "@playwright/test";

/**
 * Extended test fixture with automatic cleanup
 * This ensures proper resource cleanup after each test to prevent memory leaks
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // Use the page in the test
    await use(page);

    // Cleanup: Close the page after each test
    // This prevents browser context accumulation and memory leaks
    await page.close().catch(() => {
      // Ignore errors if page is already closed
    });
  },

  context: async ({ context }, use) => {
    // Use the context in the test
    await use(context);

    // Cleanup: Close all pages in the context
    const pages = context.pages();
    await Promise.all(
      pages.map((p) =>
        p.close().catch(() => {
          // Ignore errors if page is already closed
        })
      )
    );
  },
});

// Re-export expect so tests can use it from the same import
export { baseExpect as expect };
