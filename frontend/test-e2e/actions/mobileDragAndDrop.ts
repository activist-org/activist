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

  // Wait for the operation to complete
  await page.waitForTimeout(300);
}
