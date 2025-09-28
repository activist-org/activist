// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";

/**
 * Mobile drag and drop utility for vuedraggable components
 * Uses Playwright's built-in dragTo method with mobile-optimized settings
 */
export async function mobileDragAndDrop(
  page: Page,
  sourceHandle: Locator,
  targetHandle: Locator
): Promise<void> {
  // Use Playwright's built-in dragTo method
  await sourceHandle.dragTo(targetHandle, {
    force: true,
  });

  // Wait for the drag operation to complete by checking for network activity
  // This ensures any API calls triggered by the drag operation have finished
  await page.waitForLoadState("networkidle");

  // Wait for any CSS transitions/animations to complete
  // This is more reliable than a fixed timeout
  await page.waitForFunction(
    () => {
      const elements = document.querySelectorAll('[class*="sortable"]');
      return Array.from(elements).every(
        (el) =>
          !el.classList.contains("sortable-ghost") &&
          !el.classList.contains("sortable-chosen") &&
          !el.classList.contains("sortable-drag")
      );
    },
    { timeout: 2000 }
  );
}
