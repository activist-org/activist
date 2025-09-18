// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { newEditModal } from "~/test-e2e/component-objects/EditModal";
import { newOrganizationMenu } from "~/test-e2e/component-objects/OrganizationMenu";
import { newShareModal } from "~/test-e2e/component-objects/ShareModal";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { newSocialLinksModal } from "~/test-e2e/component-objects/SocialLinksModal";

export const newOrganizationPage = (page: Page) => ({
  // Main page elements
  pageHeading: page.getByRole("heading", { level: 1 }),
  shareButton: page.getByRole("button", {
    name: /View options to share this organization with others/i,
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
    aboutJoinButton: page.getByRole("link", { name: /join organization/i }),
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
      .getByRole("link", { name: /view all groups/i }),
    getInvolvedJoinButton: page
      .getByTestId("card-get-involved")
      .getByRole("link", {
        name: /Start the process of joining the organization/i,
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
    eventsNewButton: page.getByRole("link", { name: /new event/i }),
    eventsSubscribeButton: page.getByRole("button", {
      name: /download the calendar/i,
    }),
  },
});
