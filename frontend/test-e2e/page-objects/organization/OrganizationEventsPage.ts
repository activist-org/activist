// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

export const newOrganizationEventsPage = (page: Page) => ({
  // Header action buttons
  eventsNewButton: page.getByRole("link", {
    name: new RegExp(
      getEnglishText(
        "i18n.pages.organizations.events.new_org_event_aria_label"
      ),
      "i"
    ),
  }),
  eventsSubscribeButton: page.getByRole("button", {
    name: new RegExp(
      getEnglishText(
        "i18n.pages.organizations._global.subscribe_to_events_aria_label"
      ),
      "i"
    ),
  }),

  // Events list elements
  eventsList: page.getByTestId("organization-events-list"),
  eventCards: page.getByTestId("event-card"),

  // Individual event card elements
  getEventCard: (index: number) => page.getByTestId("event-card").nth(index),
  getEventTitle: (index: number) =>
    page.getByTestId("event-card").nth(index).locator("h3, h2").first(),
  getEventLink: (index: number) =>
    page.getByTestId("event-card").nth(index).locator("a").first(),
  getEventDate: (index: number) =>
    page.getByTestId("event-card").nth(index).locator("[class*='date']"),
  getEventLocation: (index: number) =>
    page.getByTestId("event-card").nth(index).locator("[class*='location']"),

  // Event menu interactions
  getEventMenuButton: (index: number) =>
    page.getByTestId("event-card").nth(index).getByTestId("menu-button"),
  getEventMenuTooltip: (index: number) =>
    page.getByTestId("event-card").nth(index).getByTestId("menu-tooltip"),
  getEventShareButton: (index: number) =>
    page
      .getByTestId("event-card")
      .nth(index)
      .getByRole("button", {
        name: new RegExp(
          getEnglishText("i18n._global.share_event_aria_label"),
          "i"
        ),
      }),
  getEventSubscribeButton: (index: number) =>
    page
      .getByTestId("event-card")
      .nth(index)
      .getByRole("button", {
        name: new RegExp(
          getEnglishText("i18n._global.subscribe_to_event_aria_label"),
          "i"
        ),
      }),

  // Empty state
  emptyState: page.getByTestId("empty-state"),
  emptyStateMessage: page.getByTestId("empty-state").locator("p").first(),

  // Event navigation helpers
  navigateToEvent: async (index: number) => {
    const eventLink = page
      .getByTestId("event-card")
      .nth(index)
      .locator("a")
      .first();
    await eventLink.click();
  },

  // Count helpers
  getEventCount: async () => {
    return await page.getByTestId("event-card").count();
  },
});
