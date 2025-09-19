// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { newEditModal } from "~/test-e2e/component-objects/EditModal";
import { newOrganizationMenu } from "~/test-e2e/component-objects/OrganizationMenu";
import { newShareModal } from "~/test-e2e/component-objects/ShareModal";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { newSocialLinksModal } from "~/test-e2e/component-objects/SocialLinksModal";
import { getEnglishText } from "~/utils/i18n";

export const newOrganizationPage = (page: Page) => ({
  // Main page elements
  pageHeading: page.getByRole("heading", { level: 1 }),
  shareButton: page.getByRole("button", {
    name: new RegExp(
      getEnglishText("i18n._global.share_organization_aria_label"),
      "i"
    ),
  }),

  // Navigation components
  sidebar: newSidebarLeft(page),
  menu: newOrganizationMenu(page),

  // Modals (component objects)
  shareModal: newShareModal(page),
  editModal: newEditModal(page),
  socialLinksModal: newSocialLinksModal(page),

  // About page content
  aboutPage: {
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
      .first(),
    aboutExpandTextButton: page.getByTestId("expand-text-button"),
    aboutCollapseTextButton: page.getByTestId("collapse-text-button"),
    getInvolvedCard: page.getByTestId("card-get-involved"),
    getInvolvedCardEditIcon: page
      .getByTestId("card-get-involved")
      .locator("div.cursor-pointer")
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
    connectCard: page.getByTestId("card-connect"),
    connectCardEditIcon: page
      .getByTestId("card-connect")
      .locator("div.cursor-pointer")
      .first(),
    imageCarousel: page.getByTestId("image-carousel"),
  },

  // Events page content
  eventsPage: {
    eventsNewButton: page.getByRole("link", {
      name: new RegExp(
        getEnglishText(
          "i18n.pages.organizations.events.new_org_event_aria_label"
        ),
        "i"
      ),
    }),
    eventsSubscribeButton: page.getByRole("button", {
      name: new RegExp(
        getEnglishText(
          "i18n.pages.organizations._global.subscribe_to_events_aria_label"
        ),
        "i"
      ),
    }),
  },
});
