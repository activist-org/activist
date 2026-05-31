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
    detailsForm: root.locator("#group-details"),
    nameField: root.locator("#form-item-name"),
    taglineField: root.locator("#form-item-tagline"),
    descriptionField: root.locator("#form-item-description"),
    organizationCombobox: root.locator("#form-item-organization"),

    // MARK: Validation Errors (step 1)
    nameError: root.getByTestId("form-item-name-error"),
    descriptionError: root.getByTestId("form-item-description-error"),
    organizationError: root.getByTestId("form-item-organization-error"),

    // MARK: Validation Errors (step 2 - location)
    countryError: root.getByTestId("form-item-country-error"),
    cityError: root.getByTestId("form-item-city-error"),

    // MARK: Location
    locationForm: root.locator("#event-location"),
    // Use input[id=...] to avoid matching the <Combobox as="div"> root which shares the same id.
    countryField: root.locator("input#form-item-country"),
    cityField: root.locator("#form-item-city"),
    submitLocationButton: root.locator("#event-location-submit"),

    // MARK: Step Buttons
    getNextStepButton(): Locator {
      return root.getByRole("button", {
        name: new RegExp(
          getEnglishText("i18n.components.submit_aria_label"),
          "i"
        ),
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
