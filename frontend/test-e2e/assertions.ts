// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "playwright";

import { expect } from "playwright/test";

/**
 * Assertion helper to verify that the page has the expected theme applied by checking the class on the <html> element.
 * @param page - The Playwright Page object representing the browser page
 * @param theme - The expected theme class name to be present on the <html> element (e.g., "light-theme", "dark-theme")
 * @returns A promise that resolves if the assertion passes, or rejects with an error if it fails.
 */
export async function expectTheme(page: Page, theme: string): Promise<void> {
  await expect(page.locator("html")).toHaveClass(theme);
}
