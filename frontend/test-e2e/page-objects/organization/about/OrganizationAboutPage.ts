// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

export const newOrganizationAboutPage = (page: Page) => ({
  // MARK: About Card

  aboutJoinButton: page.getByRole("link", {
    name: new RegExp(
      getEnglishText("i18n._global.join_organization_aria_label"),
      "i"
    ),
  }),
  aboutCard: page.getByTestId("card-about"),
  aboutCardEditIcon: page
    .getByTestId("card-about")
    .getByTestId("icon-edit")
    .first(),
  aboutExpandTextButton: page.getByTestId("expand-text-button"),
  aboutCollapseTextButton: page.getByTestId("collapse-text-button"),

  // MARK: Get Involved Card

  getInvolvedCard: page.getByTestId("card-get-involved"),
  getInvolvedCardEditIcon: page
    .getByTestId("card-get-involved")
    .getByTestId("icon-edit")
    .first(),
  getInvolvedCardText: page
    .getByTestId("card-get-involved")
    .locator("p")
    .first(),
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

  // MARK: Connect Card

  connectCard: page.getByTestId("card-connect"),
  connectCardEditIcon: page
    .getByTestId("card-connect")
    .getByTestId("icon-edit")
    .first(),

  // MARK: Media

  imageCarousel: page.getByTestId("image-carousel"),
});
