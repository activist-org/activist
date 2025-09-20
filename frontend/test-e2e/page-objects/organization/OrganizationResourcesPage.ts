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
  resourcesList: page.locator(".flex.flex-col.gap-4"),
  resourceCards: page.locator(".card-style"),

  // Individual resource card elements
  getResourceCard: (index: number) => page.locator(".card-style").nth(index),
  getResourceDragHandle: (index: number) =>
    page
      .locator(".card-style")
      .nth(index)
      .locator("[name='bi:grip-horizontal']"),
  getResourceLink: (index: number) =>
    page.locator(".card-style").nth(index).locator("a").first(),
  getResourceIcon: (index: number) =>
    page
      .locator(".card-style")
      .nth(index)
      .locator("[name='bi:file-earmark-text']"),

  // Empty state
  emptyState: page.getByTestId("empty-state"),

  // Modal elements (opened by new resource button)
  resourceModal: page.locator("#modal").first(),
});
