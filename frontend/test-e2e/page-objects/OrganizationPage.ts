// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";

import { newOrganizationMenu } from "~/test-e2e/component-objects/OrganizationMenu";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";

export const newOrganizationPage = (page: Page) => ({
  heading: page.getByRole("heading", { level: 1 }),
  shareButton: page.getByRole("button", {
    name: /View options to share this organization with others/i,
  }),
  shareModal: page.locator("#modal").first(),
  closeModalButton: (shareModal: Locator) =>
    shareModal.getByTestId("modal-close-button"),

  // Use existing component objects for both desktop and mobile
  sidebar: newSidebarLeft(page),
  menu: newOrganizationMenu(page),

  // Page content verification with proper data-testid selectors
  aboutPage: {
    // Join Organization button (BtnRouteExternal in about.vue)
    joinButton: page.getByRole("link", { name: /join organization/i }),
    // Share button (BtnAction in about.vue)
    shareButton: page.getByRole("button", { name: /share/i }),
    // CardAboutOrganization component with data-testid
    aboutCard: page.getByTestId("card-about"),
    // CardGetInvolvedOrganization component with data-testid
    getInvolvedCard: page.getByTestId("card-get-involved"),
    // CardConnectOrganization component with data-testid
    connectCard: page.getByTestId("card-connect"),
    // MediaImageCarouselFull component with data-testid
    imageCarousel: page.getByTestId("image-carousel"),
    // Text expand/collapse buttons in CardAboutOrganization
    expandTextButton: page.getByTestId("expand-text-button"),
    collapseTextButton: page.getByTestId("collapse-text-button"),
  },

  eventsPage: {
    // New event button
    newEventButton: page.getByRole("link", { name: /new event/i }),
    subscribeButton: page.getByRole("button", {
      name: /download the calendar/i,
    }),
  },
});
