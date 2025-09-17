// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";

import { newOrganizationMenu } from "~/test-e2e/component-objects/OrganizationMenu";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";

export const newOrganizationPage = (page: Page) => ({
  // Main page elements
  heading: page.getByRole("heading", { level: 1 }),
  shareButton: page.getByRole("button", {
    name: /View options to share this organization with others/i,
  }),
  shareModal: page.locator("#modal").first(),
  closeModalButton: (shareModal: Locator) =>
    shareModal.getByTestId("modal-close-button"),

  // Navigation components
  sidebar: newSidebarLeft(page),
  menu: newOrganizationMenu(page),

  // About page content
  aboutPage: {
    joinButton: page.getByRole("link", { name: /join organization/i }),
    aboutCard: page.getByTestId("card-about"),
    getInvolvedCard: page.getByTestId("card-get-involved"),
    connectCard: page.getByTestId("card-connect"),
    imageCarousel: page.getByTestId("image-carousel"),
    expandTextButton: page.getByTestId("expand-text-button"),
    collapseTextButton: page.getByTestId("collapse-text-button"),
  },

  // Events page content
  eventsPage: {
    newEventButton: page.getByRole("link", { name: /new event/i }),
    subscribeButton: page.getByRole("button", {
      name: /download the calendar/i,
    }),
  },
});
