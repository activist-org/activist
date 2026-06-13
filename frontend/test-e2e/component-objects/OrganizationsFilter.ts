// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

/**
 * Page object for the Organizations Filter component (SidebarLeftFilterOrganization).
 *
 * Provides locators for all interactive filter elements including:
 * - Country combobox
 * - City search input
 * - Topics combobox
 *
 * @param parent - The parent Page or Locator to scope the component within
 * @returns Object containing locators for all filter elements
 *
 * @example
 * ```ts
 * const organizationsFilter = newOrganizationsFilter(page);
 * await organizationsFilter.cityInput.fill("Berlin");
 * ```
 */
export const newOrganizationsFilter = (parent: Page | Locator) => {
  const root = parent.getByTestId("organizations-filter");

  return {
    /**
     * Root container of the organizations filter component.
     */
    root,

    /**
     * Country combobox filter.
     */
    countrySection: root.getByTestId("organizations-filter-country"),

    /**
     * City text input filter.
     */
    citySection: root.getByTestId("organizations-filter-city"),

    /**
     * Topics combobox filter section.
     */
    topicsSection: root.getByTestId("organizations-filter-topics"),

    /**
     * Helper method to get the city input field.
     */
    getCityInput: () => root.locator("#form-item-city"),
  };
};

/**
 * Type definition for the OrganizationsFilter page object.
 */
export type OrganizationsFilter = ReturnType<typeof newOrganizationsFilter>;
