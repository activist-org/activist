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
  editModal: page.locator("#modal").first(),
  editModalSubmitButton: (editModal: Locator) =>
    editModal.locator("#form-submit-id"),
  editModalForm: (editModal: Locator) => editModal.locator("#form-id"),
  editModalDescriptionField: (editModal: Locator) =>
    editModal.locator("#form-item-description"),
  editModalGetInvolvedField: (editModal: Locator) =>
    editModal.locator("#form-item-getInvolved"),
  editModalJoinUrlField: (editModal: Locator) =>
    editModal.locator("#form-item-getInvolvedUrl"),

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
    editAboutIcon: page
      .getByTestId("card-about")
      .locator("div.cursor-pointer")
      .first(),
    // Get Involved card specific elements
    getInvolvedEditIcon: page
      .getByTestId("card-get-involved")
      .locator("div.cursor-pointer")
      .first(),
    getInvolvedText: page.getByTestId("card-get-involved").locator("p").first(),
    getInvolvedViewGroupsButton: page
      .getByTestId("card-get-involved")
      .getByRole("link", { name: /view all groups/i }),
    getInvolvedJoinButton: page
      .getByTestId("card-get-involved")
      .getByRole("link", {
        name: /Start the process of joining the organization/i,
      }),
  },

  // Events page content
  eventsPage: {
    newEventButton: page.getByRole("link", { name: /new event/i }),
    subscribeButton: page.getByRole("button", {
      name: /download the calendar/i,
    }),
  },
});
