// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

export const newOrganizationPage = (page: Page) => ({
  heading: page.getByRole("heading", { level: 1 }),
  shareButton: page
    .getByRole("link", {
      name: /Navigate to the page for this organization/i,
    })
    .locator("xpath=following-sibling::div")
    .getByRole("button")
    .first(),
  tooltip: (shareButton: any) => shareButton.locator("div.tooltip"),
  tooltipButton: (shareButton: any) => shareButton.locator("div.tooltip").locator("button"),
  shareModal: page.locator("#modal").first(),
  closeModalButton: (shareModal: any) => shareModal.getByTestId("modal-close-button"),
});