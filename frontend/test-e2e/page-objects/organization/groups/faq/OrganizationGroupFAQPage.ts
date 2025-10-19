// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

// Import page-specific features.
import { FAQCard } from "./features/FAQCard";
import { FAQDragDrop } from "./features/FAQDragDrop";
import { FAQList } from "./features/FAQList";
import { FAQModal } from "./features/FAQModal";

/**
 * Page Object Model for Organization Group FAQ Page
 * Handles interactions with the group FAQ page within an organization
 *
 * Composed from focused features for better maintainability.
 */
export const newOrganizationGroupFAQPage = (page: Page) => {
  return {
    // Compose from page-specific features.
    ...FAQList(page),
    ...FAQCard(page),
    ...FAQModal(page),
    ...FAQDragDrop(page),

    // MARK: Page Elements

    get newFaqButton() {
      return page.getByRole("button", {
        name: new RegExp(
          getEnglishText("i18n.pages._global.new_faq_aria_label"),
          "i"
        ),
      });
    },

    // MARK: Tab Navigation

    get tabs() {
      return page.getByRole("tablist");
    },

    get aboutTab() {
      return page.getByRole("tab", {
        name: new RegExp(getEnglishText("i18n._global.about"), "i"),
      });
    },

    get eventsTab() {
      return page.getByRole("tab", {
        name: new RegExp(getEnglishText("i18n._global.events"), "i"),
      });
    },

    get resourcesTab() {
      return page.getByRole("tab", {
        name: new RegExp(getEnglishText("i18n._global.resources"), "i"),
      });
    },

    get faqTab() {
      return page.getByRole("tab", {
        name: new RegExp(getEnglishText("i18n._global.faq"), "i"),
      });
    },

    // MARK: Page Actions

    async clickNewFaq() {
      await this.newFaqButton.click();
    },

    async clickAboutTab() {
      await this.aboutTab.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForURL(/.*\/groups\/.*\/about/);
    },

    async clickEventsTab() {
      await this.eventsTab.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForURL(/.*\/groups\/.*\/events/);
    },

    async clickResourcesTab() {
      await this.resourcesTab.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForURL(/.*\/groups\/.*\/resources/);
    },

    async clickFaqTab() {
      await this.faqTab.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForURL(/.*\/groups\/.*\/faq/);
    },

    async isNewFaqButtonVisible() {
      return await this.newFaqButton.isVisible();
    },

    async isFaqTabActive() {
      return (await this.faqTab.getAttribute("aria-selected")) === "true";
    },
  };
};

export type GroupFaqPage = ReturnType<typeof newOrganizationGroupFAQPage>;
