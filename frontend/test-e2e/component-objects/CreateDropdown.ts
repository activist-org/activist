// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";

import { getEnglishText } from "#shared/utils/i18n";

export interface CreateDropdownOptions {
  /** Container for the Create button. Default: #sidebar-left. Use #drawer-navigation on mobile after opening the hamburger. */
  root?: Locator;
}

export const newCreateDropdown = (
  page: Page,
  options?: CreateDropdownOptions
) => {
  const root = options?.root ?? page.locator("#sidebar-left");
  const createButton = root.getByRole("button", {
    name: new RegExp(
      getEnglishText("i18n.components.dropdown_create.create_aria_label"),
      "i"
    ),
  });

  return {
    // MARK: Public Locators
    root,
    createButton,

    // MARK: Interaction Methods
    async clickNewEvent(): Promise<void> {
      await createButton.click();
      await root
        .getByRole("menuitem", {
          name: new RegExp(getEnglishText("i18n._global.new_event"), "i"),
        })
        .click();
    },

    async clickNewOrganization(): Promise<void> {
      await createButton.click();
      await root
        .getByRole("menuitem", {
          name: new RegExp(
            getEnglishText("i18n.components.dropdown_create.new_organization"),
            "i"
          ),
        })
        .click();
    },

    async clickNewGroup(): Promise<void> {
      await createButton.click();
      await root
        .getByRole("menuitem", {
          name: new RegExp(getEnglishText("i18n._global.new_group"), "i"),
        })
        .click();
    },
  };
};

export type CreateDropdown = ReturnType<typeof newCreateDropdown>;
