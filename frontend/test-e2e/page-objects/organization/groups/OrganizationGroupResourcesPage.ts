// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

/**
 * Page Object Model for Organization Group Resources Page
 * Handles interactions with the group resources page within an organization
 */
export class OrganizationGroupResourcesPage {
  constructor(private readonly page: Page) {}

  // Header elements
  get newResourceButton() {
    return this.page.getByRole("button", { name: /new resource/i });
  }

  // Resource cards
  get resourceCards() {
    return this.page.locator('[data-testid="resource-card"]');
  }

  get firstResourceCard() {
    return this.resourceCards.first();
  }

  get lastResourceCard() {
    return this.resourceCards.last();
  }

  // Resource drag handles
  getResourceDragHandle(index: number) {
    return this.resourceCards.nth(index).getByTestId("resource-drag-handle");
  }

  // Resource links
  getResourceLink(index: number) {
    return this.resourceCards.nth(index).getByTestId("resource-link");
  }

  // Resource icons
  getResourceIcon(index: number) {
    return this.resourceCards.nth(index).getByTestId("resource-icon");
  }

  // Resource titles
  getResourceTitle(index: number) {
    return this.resourceCards.nth(index).locator("h3");
  }

  // Empty state
  get emptyState() {
    return this.page.locator('[data-testid="empty-state"]');
  }

  get emptyStateMessage() {
    return this.emptyState.getByText(/no resources found/i);
  }

  // Tab navigation
  get tabs() {
    return this.page.locator('[data-testid="tabs"]');
  }

  get aboutTab() {
    return this.tabs.getByRole("tab", { name: /about/i });
  }

  get eventsTab() {
    return this.tabs.getByRole("tab", { name: /events/i });
  }

  get resourcesTab() {
    return this.tabs.getByRole("tab", { name: /resources/i });
  }

  get faqTab() {
    return this.tabs.getByRole("tab", { name: /faq/i });
  }

  // Actions
  async clickNewResource() {
    await this.newResourceButton.click();
  }

  async clickResourceLink(index: number) {
    await this.getResourceLink(index).click();
  }

  async clickAboutTab() {
    await this.aboutTab.click();
  }

  async clickEventsTab() {
    await this.eventsTab.click();
  }

  async clickResourcesTab() {
    await this.resourcesTab.click();
  }

  async clickFaqTab() {
    await this.faqTab.click();
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
