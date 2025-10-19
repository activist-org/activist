// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

/**
 * Resource Card Feature
 * Handles individual resource card interactions.
 */
export const ResourceCard = (page: Page) => {
  return {
    // MARK: Card Selectors

    getResourceCard(index: number) {
      return page.getByTestId("resource-card").nth(index);
    },

    getResourceLink(index: number) {
      return page
        .getByTestId("resource-card")
        .nth(index)
        .getByTestId("resource-link");
    },

    getResourceIcon(index: number) {
      return page
        .getByTestId("resource-card")
        .nth(index)
        .getByTestId("resource-icon");
    },

    getResourceTitle(index: number) {
      return page
        .getByTestId("resource-card")
        .nth(index)
        .getByRole("heading", { level: 3 });
    },

    // MARK: Menu Elements

    getResourceMenuButton(index: number) {
      return page
        .getByTestId("resource-card")
        .nth(index)
        .getByTestId("menu-button");
    },

    getResourceMenuTooltip(index: number) {
      return page
        .getByTestId("resource-card")
        .nth(index)
        .getByTestId("menu-tooltip");
    },

    getResourceShareButton(index: number) {
      return page
        .getByTestId("resource-card")
        .nth(index)
        .getByTestId("menu-tooltip")
        .getByRole("button", {
          name: new RegExp(getEnglishText("i18n._global.share"), "i"),
        });
    },

    getResourceEditButton(index: number) {
      return page
        .getByTestId("resource-card")
        .nth(index)
        .getByTestId("icon-edit");
    },

    // MARK: Actions

    async clickResourceLink(index: number) {
      await this.getResourceLink(index).click();
    },

    async clickResourceMenu(index: number) {
      await this.getResourceMenuButton(index).click();
    },

    async clickResourceShare(index: number) {
      await this.getResourceShareButton(index).click();
    },

    async clickResourceEdit(index: number) {
      await this.getResourceEditButton(index).click();
    },

    // MARK: Content Methods

    async getResourceTitleText(index: number) {
      return await this.getResourceTitle(index).textContent();
    },

    async getResourceUrl(index: number) {
      const link = this.getResourceLink(index);
      return await link.getAttribute("href");
    },
  };
};
export type ResourceCardType = ReturnType<typeof ResourceCard>;
