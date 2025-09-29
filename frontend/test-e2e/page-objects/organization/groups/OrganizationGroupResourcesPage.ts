// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

/**
 * Page Object Model for Organization Group Resources Page
 * Handles interactions with the group resources page within an organization
 */
export class OrganizationGroupResourcesPage {
  constructor(private readonly page: Page) {}

  // Header elements
  get newResourceButton() {
    return this.page.getByRole("button", {
      name: new RegExp(
        getEnglishText("i18n.pages._global.resources.new_resource_aria_label"),
        "i"
      ),
    });
  }

  // Resource list elements
  get resourcesList() {
    return this.page.getByTestId("organization-group-resources-list");
  }

  get resourceCards() {
    return this.page.getByTestId("resource-card");
  }

  get firstResourceCard() {
    return this.resourceCards.first();
  }

  get lastResourceCard() {
    return this.resourceCards.last();
  }

  // Individual resource card elements
  getResourceCard(index: number) {
    return this.page.getByTestId("resource-card").nth(index);
  }

  getResourceDragHandle(index: number) {
    return this.page
      .getByTestId("resource-card")
      .nth(index)
      .getByTestId("resource-drag-handle");
  }

  getResourceLink(index: number) {
    return this.page
      .getByTestId("resource-card")
      .nth(index)
      .getByTestId("resource-link");
  }

  getResourceIcon(index: number) {
    return this.page
      .getByTestId("resource-card")
      .nth(index)
      .getByTestId("resource-icon");
  }

  getResourceTitle(index: number) {
    return this.page.getByTestId("resource-card").nth(index).locator("h3");
  }

  // Resource menu interactions
  getResourceMenuButton(index: number) {
    return this.page
      .getByTestId("resource-card")
      .nth(index)
      .getByTestId("menu-button");
  }

  getResourceMenuTooltip(index: number) {
    return this.page
      .getByTestId("resource-card")
      .nth(index)
      .getByTestId("menu-tooltip");
  }

  getResourceShareButton(index: number) {
    return this.page
      .getByTestId("resource-card")
      .nth(index)
      .getByTestId("menu-tooltip")
      .getByRole("button", {
        name: new RegExp(getEnglishText("i18n._global.share"), "i"),
      });
  }

  getResourceEditButton(index: number) {
    return this.page
      .getByTestId("resource-card")
      .nth(index)
      .getByTestId("icon-edit");
  }

  // Empty state
  get emptyState() {
    return this.page.getByTestId("empty-state");
  }

  get emptyStateMessage() {
    return this.emptyState.locator("h4").first();
  }

  // Modal elements (opened by new resource button)
  get resourceModal() {
    return this.page.getByTestId("modal-ModalResourceGroup");
  }

  get resourceModalCloseButton() {
    return this.resourceModal.getByTestId("modal-close-button");
  }

  // Edit modal elements (opened by edit button)
  get editResourceModal() {
    return this.page.getByTestId("modal-ModalResourceGroup");
  }

  get editResourceModalCloseButton() {
    return this.editResourceModal.getByTestId("modal-close-button");
  }

  // Form elements within edit modal (using specific IDs from the form)
  getResourceNameInput(modal: Locator) {
    return modal.locator("#form-item-name");
  }

  getResourceDescriptionInput(modal: Locator) {
    return modal.locator("#form-item-description");
  }

  getResourceUrlInput(modal: Locator) {
    return modal.locator("#form-item-url");
  }

  getResourceSubmitButton(modal: Locator) {
    return modal.locator('button[type="submit"]');
  }

  // Tab navigation
  get tabs() {
    return this.page.locator('[role="tablist"]');
  }

  get aboutTab() {
    return this.page.getByRole("tab", {
      name: new RegExp(getEnglishText("i18n._global.about"), "i"),
    });
  }

  get eventsTab() {
    return this.page.getByRole("tab", {
      name: new RegExp(getEnglishText("i18n._global.events"), "i"),
    });
  }

  get resourcesTab() {
    return this.page.getByRole("tab", {
      name: new RegExp(getEnglishText("i18n._global.resources"), "i"),
    });
  }

  get faqTab() {
    return this.page.getByRole("tab", {
      name: new RegExp(getEnglishText("i18n._global.faq"), "i"),
    });
  }

  // Actions
  async clickNewResource() {
    await this.newResourceButton.click();
  }

  async clickResourceLink(index: number) {
    await this.getResourceLink(index).click();
  }

  async clickResourceMenu(index: number) {
    await this.getResourceMenuButton(index).click();
  }

  async clickResourceShare(index: number) {
    await this.getResourceShareButton(index).click();
  }

  async clickResourceEdit(index: number) {
    await this.getResourceEditButton(index).click();
  }

  async clickAboutTab() {
    await this.aboutTab.click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForURL(/.*\/groups\/.*\/about/);
  }

  async clickEventsTab() {
    await this.eventsTab.click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForURL(/.*\/groups\/.*\/events/);
  }

  async clickResourcesTab() {
    await this.resourcesTab.click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForURL(/.*\/groups\/.*\/resources/);
  }

  async clickFaqTab() {
    await this.faqTab.click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForURL(/.*\/groups\/.*\/faq/);
  }

  // Verification methods
  async getResourceCount() {
    return await this.resourceCards.count();
  }

  async isNewResourceButtonVisible() {
    return await this.newResourceButton.isVisible();
  }

  async isResourcesTabActive() {
    return (await this.resourcesTab.getAttribute("aria-selected")) === "true";
  }

  async isEmptyStateVisible() {
    return await this.emptyState.isVisible();
  }

  async hasResources() {
    const count = await this.getResourceCount();
    return count > 0;
  }

  // Resource content methods
  async getResourceTitleText(index: number) {
    return await this.getResourceTitle(index).textContent();
  }

  async getResourceUrl(index: number) {
    const link = this.getResourceLink(index);
    return await link.getAttribute("href");
  }

  // Drag and drop methods
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

      // Simulate drag with mouse events
      await this.page.mouse.move(startX, startY);
      await this.page.mouse.down();
      await this.page.waitForTimeout(100);

      // Move to target with intermediate steps
      const steps = 5;
      for (let i = 1; i <= steps; i++) {
        const progress = i / steps;
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;
        await this.page.mouse.move(currentX, currentY);
        await this.page.waitForTimeout(50);
      }

      await this.page.mouse.up();
      await this.page.waitForTimeout(200);
    }
  }
}
