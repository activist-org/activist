// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";

export const newEditModal = (page: Page) => ({
  modal: page.locator("#modal").first(),
  form: (modal: Locator) => modal.locator("#form-id"),
  submitButton: (modal: Locator) => modal.locator("#form-submit-id"),
  descriptionField: (modal: Locator) => modal.locator("#form-item-description"),
  getInvolvedField: (modal: Locator) => modal.locator("#form-item-getInvolved"),
  joinUrlField: (modal: Locator) => modal.locator("#form-item-getInvolvedUrl"),
});
