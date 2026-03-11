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

    // MARK: Event Type
    eventTypeForm: root.locator("#event-type-and-roles"),
    locationTypeSection: root.getByTestId("events-filter-location-type"),
    eventTypeSection: root.getByTestId("events-filter-event-type"),
    topicsCombobox: root.locator("#form-item-topics"),

    // MARK: Location
    locationForm: root.locator("#event-location"),
    locationField: root.locator("#form-item-location"),

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
          getEnglishText(
            "i18n.components.machine.steps._global.previous_step"
          ),
          "i"
        ),
      });
    },
  };
};

export type CreateEventModal = ReturnType<typeof newCreateEventModal>;
