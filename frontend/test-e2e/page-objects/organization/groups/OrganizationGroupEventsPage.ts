// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

/**
 * Page Object Model for Organization Group Events Page
 * Handles interactions with the group events page within an organization
 */
export class OrganizationGroupEventsPage {
  constructor(private readonly page: Page) {}

  // Header elements
  get newEventButton() {
    return this.page.getByRole("link", { name: /new event/i });
  }

  get subscribeToEventsButton() {
    return this.page.getByRole("button", { name: /subscribe to events/i });
  }

  // Events list and cards
  get eventsList() {
    return this.page.locator(".space-y-3.py-4");
  }

  get eventCards() {
    return this.page.locator('[data-testid="event-card"]');
  }

  get firstEventCard() {
    return this.eventCards.first();
  }

  get lastEventCard() {
    return this.eventCards.last();
  }

  // Empty state
  get emptyState() {
    return this.page.getByTestId("empty-state");
  }

  get emptyStateMessage() {
    return this.emptyState.locator("h4").first();
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
  async clickNewEvent() {
    await this.newEventButton.click();
  }

  async clickSubscribeToEvents() {
    await this.subscribeToEventsButton.click();
  }

  async clickFirstEvent() {
    await this.firstEventCard.click();
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
  async getEventCount() {
    return await this.eventCards.count();
  }

  async isNewEventButtonVisible() {
    return await this.newEventButton.isVisible();
  }

  async isSubscribeToEventsButtonVisible() {
    return await this.subscribeToEventsButton.isVisible();
  }

  async isEventsTabActive() {
    return (await this.eventsTab.getAttribute("aria-selected")) === "true";
  }

  async isEmptyStateVisible() {
    return await this.emptyState.isVisible();
  }

  async hasEvents() {
    const count = await this.getEventCount();
    return count > 0;
  }

  // Event card interactions
  getEventCard(index: number) {
    return this.eventCards.nth(index);
  }

  getEventLink(index: number) {
    return this.eventCards.nth(index).locator("a").first();
  }

  async getEventTitle(index: number) {
    const eventCard = this.eventCards.nth(index);
    return await eventCard.locator('[data-testid="event-title"]').textContent();
  }

  async getEventDate(index: number) {
    const eventCard = this.eventCards.nth(index);
    return await eventCard.locator('[data-testid="event-date"]').textContent();
  }

  async getEventLocation(index: number) {
    const eventCard = this.eventCards.nth(index);
    return await eventCard
      .locator('[data-testid="event-location"]')
      .textContent();
  }
}
