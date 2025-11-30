// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { getEnglishText } from "#shared/utils/i18n";

export const newOrganizationsHomePage = (page: Page) => ({
  // MARK: Page Elements

  heading: page.getByRole("heading", { level: 1 }),
  comboboxButton: page.getByRole("combobox"),

  // MARK: Cards

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

  // MARK: Menu Functionality

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

  // Legacy shareButton for backward compatibility (first organization card).
  shareButton: page
    .getByTestId("organization-card")
    .first()
    .getByTestId("menu-button"),

  // MARK: Modal

  shareModal: page.locator("#modal").first(),
  closeModalButton: (shareModal: Locator) =>
    shareModal.getByTestId("modal-close-button"),
});
