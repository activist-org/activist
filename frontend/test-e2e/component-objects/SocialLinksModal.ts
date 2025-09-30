// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";

export const newSocialLinksModal = (page: Page) => ({
  modal: page.locator("#modal").first(), // Keep as is - generic modal selector
  closeButton: (modal: Locator) => modal.getByTestId("modal-close-button"),
  form: (modal: Locator) => modal.locator("#form-id"), // Keep as is - specific form ID
  submitButton: (modal: Locator) => modal.locator("#form-submit-id"), // Keep as is - specific form ID
  addButton: (modal: Locator) =>
    modal.getByRole("button", { name: /add/i }).first(),
  // Social link entry fields (indexed using data-testid)
  labelField: (modal: Locator, index: number) =>
    modal.getByTestId(`social-link-label-${index}`),
  urlField: (modal: Locator, index: number) =>
    modal.getByTestId(`social-link-url-${index}`),
  removeButton: (modal: Locator, index: number) =>
    modal.getByTestId(`social-link-remove-${index}`),
});
