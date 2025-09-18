// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";

export const newSocialLinksModal = (page: Page) => ({
  modal: page.locator("#modal").first(),
  closeButton: (modal: Locator) => modal.getByTestId("modal-close-button"),
  form: (modal: Locator) => modal.locator("#form-id"),
  submitButton: (modal: Locator) => modal.locator("#form-submit-id"),
  addButton: (modal: Locator) =>
    modal.locator("button").filter({ hasText: /add/i }).first(),
  // Social link entry fields (indexed)
  labelField: (modal: Locator, index: number) =>
    modal.locator(`#form-item-socialLinks\\.${index}\\.label`),
  urlField: (modal: Locator, index: number) =>
    modal.locator(`#form-item-socialLinks\\.${index}\\.link`),
  removeButton: (modal: Locator, index: number) =>
    modal
      .locator(".flex.items-center.space-x-5")
      .nth(index)
      .getByTestId("remove-button"),
});
