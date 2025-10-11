// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

/**
 * Page Object Model for Organization Group Resources Page
 * Handles interactions with the group resources page within an organization
 */
export const newOrganizationGroupResourcesPage = (page: Page) => {
  return {
    // MARK: HEADER ELEMENTS
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

    // MARK: RESOURCE LIST ELEMENTS
    get resourcesList() {
      return page.getByTestId("organization-group-resources-list");
    },

    get resourceCards() {
      return page.getByTestId("resource-card");
    },

    get firstResourceCard() {
      return this.resourceCards.first();
    },

    get lastResourceCard() {
      return this.resourceCards.last();
    },

    // MARK: RESOURCE CARD ELEMENTS (by index)
    getResourceCard(index: number) {
      return page.getByTestId("resource-card").nth(index);
    },

    getResourceDragHandle(index: number) {
      return page
        .getByTestId("resource-card")
        .nth(index)
        .getByTestId("resource-drag-handle");
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

    // MARK: RESOURCE MENU ELEMENTS
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

    // MARK: EMPTY STATE ELEMENTS
    get emptyState() {
      return page.getByTestId("empty-state");
    },

    get emptyStateMessage() {
      return this.emptyState.getByRole("heading", { level: 4 }).first();
    },

    // MARK: MODAL ELEMENTS
    get resourceModal() {
      return page.getByTestId("modal-ModalResourceGroup");
    },

    get resourceModalCloseButton() {
      return this.resourceModal.getByTestId("modal-close-button");
    },

    get editResourceModal() {
      return page.getByTestId("modal-ModalResourceGroup");
    },

    get editResourceModalCloseButton() {
      return this.editResourceModal.getByTestId("modal-close-button");
    },

    // Form elements within modal
    getResourceNameInput(modal: Locator) {
      return modal.getByRole("textbox", {
        name: new RegExp(getEnglishText("i18n.pages.contact.name"), "i"),
      });
    },

    getResourceDescriptionInput(modal: Locator) {
      return modal.getByRole("textbox", {
        name: new RegExp(getEnglishText("i18n._global.description"), "i"),
      });
    },

    getResourceUrlInput(modal: Locator) {
      return modal.getByRole("textbox", {
        name: new RegExp(
          getEnglishText("i18n.components.form_resource.link"),
          "i"
        ),
      });
    },

    getResourceSubmitButton(modal: Locator) {
      return modal.getByRole("button", {
        name: new RegExp(getEnglishText("i18n.components.submit"), "i"),
      });
    },

    // MARK: TAB NAVIGATION ELEMENTS
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

    // MARK: ACTIONS
    async clickNewResource() {
      await this.newResourceButton.click();
    },

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

    // MARK: VERIFICATION METHODS
    async getResourceCount() {
      return await this.resourceCards.count();
    },

    async isNewResourceButtonVisible() {
      return await this.newResourceButton.isVisible();
    },

    async isResourcesTabActive() {
      return (await this.resourcesTab.getAttribute("aria-selected")) === "true";
    },

    async isEmptyStateVisible() {
      return await this.emptyState.isVisible();
    },

    async hasResources() {
      const count = await this.getResourceCount();
      return count > 0;
    },

    // MARK: RESOURCE CONTENT METHODS
    async getResourceTitleText(index: number) {
      return await this.getResourceTitle(index).textContent();
    },

    async getResourceUrl(index: number) {
      const link = this.getResourceLink(index);
      return await link.getAttribute("href");
    },

    // MARK: DRAG AND DROP METHODS
    async dragResourceToPosition(fromIndex: number, toIndex: number) {
      const sourceHandle = this.getResourceDragHandle(fromIndex);
      const targetHandle = this.getResourceDragHandle(toIndex);

      const sourceBox = await sourceHandle.boundingBox();
      const targetBox = await targetHandle.boundingBox();

      if (sourceBox && targetBox) {
        const startX = sourceBox.x + sourceBox.width / 2;
        const startY = sourceBox.y + sourceBox.height / 2;
        const endX = targetBox.x + targetBox.width / 2;
        const endY = targetBox.y + targetBox.height / 2;

        // Simulate drag with mouse events.
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        // Wait for drag to initiate (1-2 animation frames).
        await page.evaluate(
          () =>
            new Promise((resolve) => {
              requestAnimationFrame(() => requestAnimationFrame(resolve));
            })
        );

        // Move to target with intermediate steps.
        const steps = 5;
        for (let i = 1; i <= steps; i++) {
          const progress = i / steps;
          const currentX = startX + (endX - startX) * progress;
          const currentY = startY + (endY - startY) * progress;
          await page.mouse.move(currentX, currentY);
          // Smooth rendering (1 animation frame per step).
          await page.evaluate(() => new Promise(requestAnimationFrame));
        }

        await page.mouse.up();
        // No delay - let caller verify result with expect().toPass().
      }
    },
  };
};

export type GroupResourcesPage = ReturnType<
  typeof newOrganizationGroupResourcesPage
>;
