// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";

import { expect } from "@playwright/test";

/**
 * Submit a modal form with robust retry logic to handle timing/hydration issues
 * @param page - Playwright page object
 * @param modal - The modal locator
 * @param submitButton - The submit button locator
 * @param operationName - Name of the operation for error messages (e.g., "CREATE", "UPDATE", "DELETE")
 */
export async function submitModalWithRetry(
  page: Page,
  modal: Locator,
  submitButton: Locator,
  operationName: string = "operation"
) {
  // Ensure button is ready for interaction
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeEnabled();
  await submitButton.waitFor({ state: "attached", timeout: 10000 });

  // On mobile, modals can be taller than viewport - use JavaScript click to bypass viewport checks
  await submitButton.evaluate((button) => {
    if (button instanceof HTMLElement) {
      button.click();
    }
  });

  // Wait for the modal to close with retry logic
  let modalClosed = false;
  let attempts = 0;
  const maxAttempts = 3;

  while (!modalClosed && attempts < maxAttempts) {
    try {
      await expect(modal).not.toBeVisible({ timeout: 10000 });
      modalClosed = true;
    } catch {
      attempts++;

      if (attempts < maxAttempts) {
        // Try clicking the submit button again
        if (await submitButton.isVisible()) {
          await submitButton.evaluate((button) => {
            if (button instanceof HTMLElement) {
              button.click();
            }
          });
        }
      } else {
        throw new Error(
          `${operationName} modal submission failed after ${maxAttempts} attempts`
        );
      }
    }
  }
}
