// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";

export const newShareModal = (page: Page) => ({
  modal: page.locator("#modal").first(),
  closeButton: (modal: Locator) => modal.getByTestId("modal-close-button"),
});
