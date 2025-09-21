// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

export const newOrganizationResourcesPage = (page: Page) => ({
  // New resource button
  newResourceButton: page.getByRole("button", {
    name: new RegExp(
      getEnglishText("i18n.pages._global.resources.new_resource_aria_label"),
      "i"
    ),
  }),

  // Resource list elements
  resourcesList: page.getByTestId("organization-resources-list"),
  resourceCards: page.getByTestId("resource-card"),

  // Individual resource card elements
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

  // Resource menu interactions
  getResourceMenuButton: (index: number) =>
    page.getByTestId("resource-card").nth(index).getByTestId("menu-button"),
  getResourceMenuTooltip: (index: number) =>
    page.getByTestId("resource-card").nth(index).getByTestId("menu-tooltip"),
  getResourceShareButton: (index: number) =>
    page
      .getByTestId("resource-card")
      .nth(index)
      .getByRole("button", {
        name: new RegExp(getEnglishText("i18n._global.share"), "i"),
      }),

  // Empty state
  emptyState: page.getByTestId("empty-state"),

  // Modal elements (opened by new resource button)
  resourceModal: page.locator("#modal").first(),
});
