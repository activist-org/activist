// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { expect } from "@playwright/test";

/**
 * Row label regexp for country comboboxes when tests use a fixed address (e.g. Berlin) and
 * need consistent geocoding / search API behavior in English locale.
 */
export const E2E_GEO_REFERENCE_COUNTRY = /Germany/i;

/**
 * Opens a localized country combobox, then selects a listbox option by accessible name.
 *
 * Used for org create (location step) and event create (physical search form); callers supply
 * the trigger that matches their DOM (e.g. `#form-item-country` + localized label).
 *
 * @param optionListRoot - Locator that contains the option elements (usually the modal root).
 * @param countryTrigger - Combobox button that opens the country list.
 * @param optionNameMatch - `RegExp` or substring passed to `getByRole("option", { name })`.
 * @param visibilityTimeoutMs - Max wait for the option to become visible (default 5000).
 */
export async function selectCountryComboboxOption(
  optionListRoot: Locator,
  countryTrigger: Locator,
  optionNameMatch: RegExp | string,
  visibilityTimeoutMs: number = 5000
) {
  await countryTrigger.click();
  const option = optionListRoot.getByRole("option", { name: optionNameMatch });
  await expect(option).toBeVisible({ timeout: visibilityTimeoutMs });
  await option.click();
}

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
  // Ensure button is ready for interaction.
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeEnabled();
  await submitButton.waitFor({ state: "attached", timeout: 10000 });

  // On mobile, modals can be taller than viewport - use JavaScript click to bypass viewport checks.
  await submitButton.evaluate((button) => {
    if (button instanceof HTMLElement) {
      button.click();
    }
  });

  // Wait for the modal to close with retry logic.
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
        // Try clicking the submit button again.
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
