// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

export const newOrganizationAboutPage = (page: Page) => ({
  // About card elements
  aboutJoinButton: page.getByRole("link", {
    name: new RegExp(
      getEnglishText("i18n._global.join_organization_aria_label"),
      "i"
    ),
  }),
  aboutCard: page.getByTestId("card-about"),
  aboutCardEditIcon: page
    .getByTestId("card-about")
    .locator("div.cursor-pointer")
    .first(), // Keep as is - CSS class selector
  aboutExpandTextButton: page.getByTestId("expand-text-button"),
  aboutCollapseTextButton: page.getByTestId("collapse-text-button"),

  // Get Involved card elements
  getInvolvedCard: page.getByTestId("card-get-involved"),
  getInvolvedCardEditIcon: page
    .getByTestId("card-get-involved")
    .locator("div.cursor-pointer")
    .first(), // Keep as is - CSS class selector
  getInvolvedCardText: page
    .getByTestId("card-get-involved")
    .locator("p")
    .first(), // Keep as is - generic text selector
  getInvolvedViewGroupsButton: page
    .getByTestId("card-get-involved")
    .getByRole("link", {
      name: new RegExp(
        getEnglishText(
          "i18n.components.card_get_involved_organization.view_all_groups_aria_label"
        ),
        "i"
      ),
    }),
  getInvolvedJoinButton: page
    .getByTestId("card-get-involved")
    .getByRole("link", {
      name: new RegExp(
        getEnglishText("i18n._global.join_organization_aria_label"),
        "i"
      ),
    }),

  // Connect card elements
  connectCard: page.getByTestId("card-connect"),
  connectCardEditIcon: page
    .getByTestId("card-connect")
    .locator("div.cursor-pointer")
    .first(), // Keep as is - CSS class selector

  // Media elements
  imageCarousel: page.getByTestId("image-carousel"),
});
