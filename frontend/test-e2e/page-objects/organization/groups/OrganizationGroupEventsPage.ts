// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

/**
 * Page Object Model for Organization Group Events Page
 * Handles interactions with the group events page within an organization
 */
export class OrganizationGroupEventsPage {
  constructor(private readonly page: Page) {}

  // MARK: Header

  get newEventButton() {
    return this.page.getByRole("link", { name: /new event/i });
  }

  get subscribeToEventsButton() {
    return this.page.getByRole("button", { name: /subscribe to events/i });
  }

  // MARK: List and Cards

  get eventsList() {
    return this.page.locator(".space-y-3.py-4");
  }

  get eventCards() {
    return this.page.getByTestId("event-card");
  }

  get firstEventCard() {
    return this.eventCards.first();
  }

  get lastEventCard() {
    return this.eventCards.last();
  }

  // MARK: Empty State

  get emptyState() {
    return this.page.getByTestId("empty-state");
  }

  get emptyStateMessage() {
    return this.emptyState.getByRole("heading", { level: 4 }).first();
  }

  // MARK: Tab Navigation
  get tabs() {
    return this.page.getByRole("tablist");
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

  // MARK: Actions
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

  // MARK: Card Interactions

  getEventCard(index: number) {
    return this.eventCards.nth(index);
  }

  getEventLink(index: number) {
    return this.eventCards.nth(index).getByRole("link").first();
  }

  async getEventTitle(index: number) {
    const eventCard = this.eventCards.nth(index);
    return await eventCard.getByTestId("event-title").textContent();
  }

  async getEventDate(index: number) {
    const eventCard = this.eventCards.nth(index);
    return await eventCard.getByTestId("event-date").textContent();
  }

  async getEventLocation(index: number) {
    const eventCard = this.eventCards.nth(index);
    return await eventCard.getByTestId("event-location").textContent();
  }
}
