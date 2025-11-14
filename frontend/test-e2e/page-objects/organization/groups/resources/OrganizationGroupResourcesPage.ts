// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { newShareModal } from "~/test-e2e/component-objects/ShareModal";
import { getEnglishText } from "#shared/utils/i18n";

// Import page-specific features
import { ResourceCard } from "./features/ResourceCard";
import { ResourceDragDrop } from "./features/ResourceDragDrop";
import { ResourceList } from "./features/ResourceList";
import { ResourceModal } from "./features/ResourceModal";

/**
 * Page Object Model for Organization Group Resources Page.
 * Handles interactions with the group resources page within an organization.
 *
 * Composed from focused features for better maintainability.
 */
export const newOrganizationGroupResourcesPage = (page: Page) => {
  // Get global share modal (from component-objects/).
  const shareModal = newShareModal(page);

  return {
    // Compose from page-specific features.
    ...ResourceList(page),
    ...ResourceCard(page),
    ...ResourceModal(page),
    ...ResourceDragDrop(page),

    // Include global share modal.
    shareModal: shareModal.modal,
    shareModalCloseButton: shareModal.closeButton,

    // MARK: Page Elements

    get newResourceButton() {
      return page.getByRole("button", {
        name: new RegExp(
          getEnglishText(
            "i18n.pages._global.resources.new_resource_aria_label"
          ),
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

    async clickNewResource() {
      await this.newResourceButton.click();
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

    async isNewResourceButtonVisible() {
      return await this.newResourceButton.isVisible();
    },

    async isResourcesTabActive() {
      return (await this.resourcesTab.getAttribute("aria-selected")) === "true";
    },
  };
};

export type GroupResourcesPage = ReturnType<
  typeof newOrganizationGroupResourcesPage
>;
