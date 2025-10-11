// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

/**
 * Lightweight test cleanup utilities
 * Minimal cleanup that prevents test pollution without interfering with Playwright's lifecycle
 *
 * Performance optimized: Uses timeouts to avoid blocking on already-closed elements
 */
export async function cleanupTestState(page: Page): Promise<void> {
  try {
    // Quick check: if page is already closed/closing, skip cleanup.
    if (page.isClosed()) {
      return;
    }

    // Strategy: Press Escape multiple times (fast and effective).
    // This handles modals, tooltips, dropdowns without DOM queries.
    await page.keyboard.press("Escape").catch(() => {
      // Ignore if page is closing.
    });

    await page.waitForTimeout(50);

    await page.keyboard.press("Escape").catch(() => {
      // Ignore if page is closing.
    });

    // Only do explicit modal cleanup if modals are actually visible.
    // Use a short timeout to avoid blocking.
    const modals = page.locator(
      '[role="dialog"][data-headlessui-state="open"]'
    );
    const modalCount = await modals.count().catch(() => 0);

    if (modalCount > 0) {
      // Try to close visible modals quickly.
      for (let i = 0; i < Math.min(modalCount, 3); i++) {
        const modal = modals.nth(i);
        const isVisible = await modal.isVisible().catch(() => false);

        if (isVisible) {
          // Try Escape first (fastest).
          await page.keyboard.press("Escape").catch(() => {
            // Ignore errors.
          });
          break; // Only close one modal, Escape should close all
        }
      }
    }

    // Note: We intentionally DON'T clear forms or other state.
    // Each test navigates to a fresh page, so this isn't needed
    // and it slows down cleanup significantly.
  } catch (error) {
    // Silently ignore cleanup errors - they shouldn't fail tests.
    // Only log if it's not a "Test ended" or "Target closed" error.
    const errorMessage = String(error);
    if (
      !errorMessage.includes("Test ended") &&
      !errorMessage.includes("Target closed")
    ) {
      // eslint-disable-next-line no-console
      console.warn("Test cleanup warning:", error);
    }
  }
}

/**
 * Reset page state to a clean state
 * Useful for ensuring tests start from a known state
 */
export async function resetPageState(page: Page): Promise<void> {
  try {
    // Clear all cookies except auth token.
    const cookies = await page.context().cookies();
    const authCookies = cookies.filter(
      (cookie) => cookie.name === "auth.token"
    );

    await page.context().clearCookies();

    // Restore auth cookies.
    if (authCookies.length > 0) {
      await page.context().addCookies(authCookies);
    }

    // Clear local storage except auth-related data.
    await page.evaluate(() => {
      const keysToKeep = ["auth", "user", "token"];
      const storage = { ...localStorage };

      localStorage.clear();

      // Restore auth-related keys.
      keysToKeep.forEach((key) => {
        Object.keys(storage).forEach((storageKey) => {
          if (storageKey.toLowerCase().includes(key)) {
            localStorage.setItem(storageKey, storage[storageKey]);
          }
        });
      });
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Page state reset warning:", error);
  }
}
