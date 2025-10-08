// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

export const newOrganizationEventsPage = (page: Page) => ({
  // MARK: Header Action

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

  // MARK: Events List

  eventsList: page.getByTestId("organization-events-list"),
  eventCards: page.getByTestId("event-card"),

  // MARK: Event Card

  getEventCard: (index: number) => page.getByTestId("event-card").nth(index),
  getEventTitle: (index: number) =>
    page
      .getByTestId("event-card")
      .nth(index)
      .getByRole("heading", { level: 3 })
      .first(),
  getEventLink: (index: number) =>
    page.getByTestId("event-card").nth(index).getByRole("link").first(),
  getEventDate: (index: number) =>
    page.getByTestId("event-card").nth(index).locator("[class*='date']"),
  getEventLocation: (index: number) =>
    page.getByTestId("event-card").nth(index).locator("[class*='location']"),

  // MARK: Event Menu

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

  // MARK: Empty State

  emptyState: page.getByTestId("empty-state"),
  emptyStateMessage: page.getByTestId("empty-state").locator("p").first(),

  // MARK: Event Navigation

  navigateToEvent: async (index: number) => {
    const eventLink = page
      .getByTestId("event-card")
      .nth(index)
      .getByRole("link")
      .first();
    await eventLink.click();
  },

  // MARK: Count Helpers
  getEventCount: async () => {
    return await page.getByTestId("event-card").count();
  },
});
