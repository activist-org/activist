// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";

export const newSocialLinksModal = (page: Page) => ({
  modal: page.locator("#modal").first(), // Keep as is - generic modal selector
  closeButton: (modal: Locator) => modal.getByTestId("modal-close-button"),
  form: (modal: Locator) => modal.locator("#form-id"), // Keep as is - specific form ID
  submitButton: (modal: Locator) => modal.locator("#form-submit-id"), // Keep as is - specific form ID
  addButton: (modal: Locator) =>
    modal.getByRole("button", { name: /add/i }).first(),
  // Social link entry fields (indexed)
  labelField: (modal: Locator, index: number) =>
    modal.locator(`#form-item-socialLinks\\.${index}\\.label`), // Keep as is - specific form ID
  urlField: (modal: Locator, index: number) =>
    modal.locator(`#form-item-socialLinks\\.${index}\\.link`), // Keep as is - specific form ID
  removeButton: (modal: Locator, index: number) =>
    modal
      .locator(".flex.items-center.space-x-5")
      .nth(index)
      .getByTestId("remove-button"), // Keep as is - CSS class selector
});
