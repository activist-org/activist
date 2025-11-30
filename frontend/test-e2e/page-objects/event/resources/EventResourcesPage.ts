// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { getEnglishText } from "#shared/utils/i18n";

export const newEventResourcesPage = (page: Page) => ({
  // MARK: New Resource

  newResourceButton: page.getByRole("button", {
    name: new RegExp(
      getEnglishText("i18n.pages._global.resources.new_resource_aria_label"),
      "i"
    ),
  }),

  // MARK: Resource List

  resourcesList: page.getByTestId("event-resources-list"),
  resourceCards: page.getByTestId("resource-card"),

  // MARK: Resource Card

  getResourceCard: (index: number) =>
    page.getByTestId("resource-card").nth(index),
  getResourceDragHandle: (index: number) =>
    page
      .getByTestId("resource-card")
      .nth(index)
      .getByTestId("resource-drag-handle"),
  getResourceLink: (index: number) =>
    page.getByTestId("resource-card").nth(index).getByTestId("resource-link"),
  getResourceIcon: (index: number) =>
    page.getByTestId("resource-card").nth(index).getByTestId("resource-icon"),

  // MARK: Resource Menu

  getResourceMenuButton: (index: number) =>
    page.getByTestId("resource-card").nth(index).getByTestId("menu-button"),
  getResourceMenuTooltip: (index: number) =>
    page.getByTestId("resource-card").nth(index).getByTestId("menu-tooltip"),
  getResourceShareButton: (index: number) =>
    page
      .getByTestId("resource-card")
      .nth(index)
      .getByTestId("menu-tooltip")
      .getByRole("button", {
        name: new RegExp(getEnglishText("i18n._global.share"), "i"),
      }),
  getResourceEditButton: (index: number) =>
    page.getByTestId("resource-card").nth(index).getByTestId("icon-edit"),

  // MARK: Empty State

  emptyState: page.getByTestId("empty-state"),
  emptyStateMessage: page.getByTestId("empty-state").locator("p, div").first(),

  // Modal elements (opened by new resource button).
  resourceModal: page.locator("#modal").first(),
  resourceModalCloseButton: (modal: Locator) =>
    modal.getByTestId("modal-close-button"),

  // Edit modal elements (opened by edit button).
  editResourceModal: page.locator("#modal").first(),
  editResourceModalCloseButton: (modal: Locator) =>
    modal.getByTestId("modal-close-button"),

  // Form elements within edit modal (using specific IDs from the form).
  resourceNameInput: (modal: Locator) =>
    modal.getByRole("textbox", {
      name: new RegExp(getEnglishText("i18n.pages.contact.name"), "i"),
    }),
  resourceDescriptionInput: (modal: Locator) =>
    modal.getByRole("textbox", {
      name: new RegExp(getEnglishText("i18n._global.description"), "i"),
    }),
  resourceUrlInput: (modal: Locator) =>
    modal.getByRole("textbox", {
      name: new RegExp(
        getEnglishText("i18n.components.form_resource.link"),
        "i"
      ),
    }),
  resourceSubmitButton: (modal: Locator) =>
    modal.getByRole("button", {
      name: new RegExp(getEnglishText("i18n.components.submit"), "i"),
    }),

  // MARK: Utility

  getResourceCount: async () => {
    try {
      return await page.getByTestId("resource-card").count();
    } catch {
      return 0;
    }
  },
  navigateToResource: async (index: number) => {
    const resourceLink = page
      .getByTestId("resource-card")
      .nth(index)
      .getByTestId("resource-link");
    await resourceLink.click();
  },
});
