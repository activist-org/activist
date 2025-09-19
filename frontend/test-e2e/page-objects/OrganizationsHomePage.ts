// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

export const newOrganizationsHomePage = (page: Page) => ({
  // Page elements
  heading: page.getByRole("heading", { level: 1 }),
  comboboxButton: page.locator('input[role="combobox"].style-cta'),

  // Organization cards
  organizationLink: page
    .getByRole("link", {
      name: new RegExp(
        getEnglishText(
          "i18n.components._global.navigate_to_organization_aria_label"
        ),
        "i"
      ),
    })
    .first(),

  // Share functionality
  shareButton: page
    .getByRole("link", {
      name: new RegExp(
        getEnglishText(
          "i18n.components._global.navigate_to_organization_aria_label"
        ),
        "i"
      ),
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
