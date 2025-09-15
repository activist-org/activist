// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";

export const newOrganizationPage = (page: Page) => ({
  heading: page.getByRole("heading", { level: 1 }),
  shareButton: page.getByRole("button", {
    name: /View options to share this organization with others/i,
  }),
  shareModal: page.locator("#modal").first(),
  closeModalButton: (shareModal: Locator) =>
    shareModal.getByTestId("modal-close-button"),
});
