// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

/**
 * Page object for the Events Filter component (SidebarLeftFilterEvents).
 *
 * Provides locators for all interactive filter elements including:
 * - View type selector (list, map, calendar)
 * - Days ahead selector (1, 7, 30)
 * - Event type selector (learn, action)
 * - Location type selector (offline, online)
 * - Location search input
 * - Topics combobox
 *
 * @param parent - The parent Page or Locator to scope the component within
 * @returns Object containing locators for all filter elements
 *
 * @example
 * ```ts
 * const eventsFilter = newEventsFilter(page);
 * await eventsFilter.viewTypeSection.click();
 * await eventsFilter.root.waitFor({ state: 'visible' });
 * ```
 */
export const newEventsFilter = (parent: Page | Locator) => {
  const root = parent.getByTestId("events-filter");

  return {
    /**
     * Root container of the events filter component
     */
    root,

    /**
     * View type selector section (list, map, calendar views)
     */
    viewTypeSection: root.getByTestId("events-filter-view-type"),

    /**
     * Days ahead filter section (1, 7, 30 days)
     */
    daysSection: root.getByTestId("events-filter-days"),

    /**
     * Event type filter section (learn, action)
     */
    eventTypeSection: root.getByTestId("events-filter-event-type"),

    /**
     * Location type filter section (offline/in-person, online)
     */
    locationTypeSection: root.getByTestId("events-filter-location-type"),

    /**
     * Location search input section
     */
    locationSection: root.getByTestId("events-filter-location"),

    /**
     * Topics combobox filter section
     */
    topicsSection: root.getByTestId("events-filter-topics"),

    /**
     * Helper method to get a specific radio button within a section by its value
     * @param section - The section locator containing the radio buttons
     * @param value - The value attribute of the radio button
     */
    getRadioButton: (section: Locator, value: string) =>
      section.getByRole("radio", { name: new RegExp(value, "i") }),

    /**
     * Helper method to get the location input field
     */
    getLocationInput: () =>
      root.getByTestId("events-filter-location").getByRole("searchbox"),
  };
};
/**
 * Type definition for the EventsFilter page object
 */
export type EventsFilter = ReturnType<typeof newEventsFilter>;
