// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";

import { getEnglishText } from "#shared/utils/i18n";

export const newCreateEventModal = (page: Page) => {
  const root = page.getByTestId("modal-ModalCreateEvent");

  return {
    // MARK: Public Locators
    root,
    closeButton: root.getByTestId("modal-close-button"),

    // MARK: Event Details
    eventDetailsForm: root.locator("#event-details"),
    nameField: root.locator("#form-item-name"),
    taglineField: root.locator("#form-item-tagline"),
    descriptionField: root.locator("#form-item-description"),
    orgsCombobox: root.locator("#form-item-orgs"),
    groupsCombobox: root.locator("#form-item-groups"),

    // MARK: Validation Errors (step 1)
    nameError: root.getByTestId("form-item-name-error"),
    descriptionError: root.getByTestId("form-item-description-error"),
    orgsError: root.getByTestId("form-item-orgs-error"),

    // MARK: Validation Errors (step 2 - event type)
    settingError: root.getByTestId("form-item-setting-error"),
    typeError: root.getByTestId("form-item-type-error"),
    topicsError: root.getByTestId("form-item-topics-error"),

    // MARK: Validation Errors (step 3 - link online)
    onlineLinkError: root.getByTestId("form-item-onlineLocationLink-error"),

    // MARK: Validation Errors (step 4 - time)
    datesError: root.getByTestId("form-item-dates-error"),

    // MARK: Event Type
    eventTypeForm: root.locator("#event-type-and-roles"),
    locationTypeSection: root.getByTestId("events-filter-location-type"),
    eventTypeSection: root.getByTestId("events-filter-event-type"),
    topicsCombobox: root.locator("#form-item-topics"),

    // MARK: Location (in-person path)
    locationSearchForm: root.locator("#search-location"),
    // input#form-item-country narrows to the <input> only, avoiding the strict
    // mode violation caused by FormSelectorComboboxCountry rendering both a
    // wrapper div and an inner input with the same id.
    countrySearchField: root.locator("input#form-item-country"),
    citySearchField: root.locator("#form-item-city"),
    streetSearchField: root.locator("#form-item-street"),
    // The Form component sets id="{form-id}-submit" on its submit button.
    locationSearchButton: root.locator("#search-location-submit"),
    locationForm: root.locator("#event-location"),
    locationField: root.locator("#form-item-location"),
    locationResultsGroup: root.locator("#form-item-location"),

    // MARK: Validation Errors (location search form)
    countrySearchError: root.getByTestId("form-item-country-error"),
    citySearchError: root.getByTestId("form-item-city-error"),
    streetSearchError: root.getByTestId("form-item-street-error"),

    // MARK: Validation Errors (location picker - form-item-location)
    locationError: root.getByTestId("form-item-location-error"),

    // The location step has two Form submit buttons (search + picker). Use
    // the picker form's id directly to avoid a strict mode violation.
    locationNextButton: root.locator("#event-location-submit"),

    // MARK: Link Online
    linkOnlineForm: root.locator("#event-link-online"),
    onlineLinkField: root.locator("#form-item-onlineLocationLink"),

    // MARK: Time
    timeForm: root.locator("#event-location-and-time"),

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

export type CreateEventModal = ReturnType<typeof newCreateEventModal>;
