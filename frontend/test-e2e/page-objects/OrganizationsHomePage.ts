// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";

export const newOrganizationsHomePage = (page: Page) => ({
  heading: page.getByRole("heading", { level: 1 }),
  organizationLink: page
    .getByRole("link", {
      name: /Navigate to the page for this organization/i,
    })
    .first(),
  shareButton: page
    .getByRole("link", {
      name: /Navigate to the page for this organization/i,
    })
    .locator("xpath=following-sibling::div")
    .getByRole("button")
    .first(),
  tooltip: (shareButton: Locator) => shareButton.locator("div.tooltip"),
  tooltipButton: (shareButton: Locator) =>
    shareButton.locator("div.tooltip").locator("button"),
  shareModal: page.locator("#modal").first(),
  closeModalButton: (shareModal: Locator) =>
    shareModal.getByTestId("modal-close-button"),
  comboboxButton: page.locator('input[role="combobox"].style-cta'),
});
