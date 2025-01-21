// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "playwright";

/**
 * Playwright's page.keyboard.press method is supposed to allow this with "ControlOrMeta".
 * https://playwright.dev/docs/api/class-keyboard#keyboard-press
 *
 * Unfortunately, it does not work due to a bug:
 * https://github.com/microsoft/playwright-java/issues/1643
 *
 * It still doesn't work as of version 1.49.1.
 *
 * @param page Page
 * @param key string representing desired key press
 */
export async function pressControlKey(page: Page, key: string) {
  const isMac = await page.evaluate(() => /Mac/i.test(navigator.userAgent));
  if (isMac) {
    await page.keyboard.press(`Meta+${key}`);
  } else {
    await page.keyboard.press(`Control+${key}`);
  }
}
