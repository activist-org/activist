// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";

export const newOrganizationsHomePage = (page: Page) => ({
  // Page elements
  heading: page.getByRole("heading", { level: 1 }),
  comboboxButton: page.locator('input[role="combobox"].style-cta'),

  // Organization cards
  organizationLink: page
    .getByRole("link", {
      name: /Navigate to the page for this organization/i,
    })
    .first(),

  // Share functionality
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

  // Modal elements
  shareModal: page.locator("#modal").first(),
  closeModalButton: (shareModal: Locator) =>
    shareModal.getByTestId("modal-close-button"),
});
