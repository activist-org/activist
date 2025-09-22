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

  // Organization menu functionality (using the new generic menu selectors)
  getOrganizationMenuButton: (index: number) =>
    page.getByTestId("organization-card").nth(index).getByTestId("menu-button"),
  getOrganizationMenuTooltip: (index: number) =>
    page
      .getByTestId("organization-card")
      .nth(index)
      .getByTestId("menu-tooltip"),
  getOrganizationShareButton: (index: number) =>
    page
      .getByTestId("organization-card")
      .nth(index)
      .getByTestId("menu-tooltip")
      .getByRole("button", {
        name: new RegExp(
          getEnglishText("i18n._global.share_organization_aria_label"),
          "i"
        ),
      }),

  // Legacy shareButton for backward compatibility (first organization card)
  shareButton: page
    .getByTestId("organization-card")
    .first()
    .getByTestId("menu-button"),

  // Modal elements
  shareModal: page.locator("#modal").first(),
  closeModalButton: (shareModal: Locator) =>
    shareModal.getByTestId("modal-close-button"),
});
