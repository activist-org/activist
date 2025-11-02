// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

export const newEventAboutPage = (page: Page) => ({
  // MARK: About Card

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
  getInvolvedJoinButton: page
    .getByTestId("card-get-involved")
    .getByRole("link", {
      name: new RegExp(
        getEnglishText("i18n._global.participate_in_event_aria_label"),
        "i"
      ),
    }),

  // MARK: Connect Card

  connectCard: page.getByTestId("card-connect"),
  connectCardEditIcon: page
    .getByTestId("card-connect")
    .getByTestId("edit-icon")
    .first(),

  // MARK: Media
  imageCarousel: page.getByTestId("image-carousel"),
});
