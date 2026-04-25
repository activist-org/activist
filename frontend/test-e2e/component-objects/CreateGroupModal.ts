// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";

import { getEnglishText } from "#shared/utils/i18n";

export const newCreateGroupModal = (page: Page) => {
  const root = page.getByTestId("modal-ModalCreateGroup");

  return {
    // MARK: Public Locators
    root,
    closeButton: root.getByTestId("modal-close-button"),

    // MARK: Details
    detailsForm: root.locator("#event-details"),
    nameField: root.locator("#form-item-name"),
    taglineField: root.locator("#form-item-tagline"),
    descriptionField: root.locator("#form-item-description"),
    organizationCombobox: root.locator("#form-item-organization"),

    // MARK: Location
    locationForm: root.locator("#event-location"),
    countryField: root.locator("#form-item-country"),
    cityField: root.locator("#form-item-city"),

    // MARK: Step Buttons
    getNextStepButton(): Locator {
      return root.getByRole("button", {
        name: new RegExp(getEnglishText("i18n._global.next_step"), "i"),
      });
    },

    getPreviousStepButton(): Locator {
      return root.getByRole("button", {
        name: new RegExp(
          getEnglishText("i18n.components.machine.steps._global.previous_step"),
          "i"
        ),
      });
    },
  };
};

export type CreateGroupModal = ReturnType<typeof newCreateGroupModal>;
