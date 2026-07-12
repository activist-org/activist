// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { getEnglishText } from "#shared/utils/i18n";

export const newEventDetailsEditModal = (page: Page) => {
  const root = page.getByTestId("modal-ModalEventDetails");

  return {
    // MARK: Public Locators
    root,
    closeButton: root.getByTestId("modal-close-button"),
    heading: root.getByRole("heading", {
      name: new RegExp(
        getEnglishText(
          "i18n.components.modal_event_details.edit_event_details"
        ),
        "i"
      ),
    }),
    form: root.locator("#event-details-edit"),
    submitButton: root.locator("#event-details-edit-submit"),
    orgsComboboxSection: root.locator("div#form-item-orgs").first(),
    orgsCombobox: root.locator("input#form-item-orgs"),
    orgsComboboxButton: root
      .locator("div#form-item-orgs")
      .first()
      .getByRole("button", {
        name: new RegExp(getEnglishText("i18n._global.organizations"), "i"),
      }),
    selectedOrgChips: root.locator(
      "div#form-item-orgs ul:not(#form-item-orgs-options) li"
    ),
    orgDropdownOptions: root.locator("#form-item-orgs-options [role='option']"),
    locationTypeSection: root.locator("#form-item-locationType"),
    onlineLinkField: root.locator("input#form-item-onlineLocationLink"),
    scheduleCalendar: root.locator(".vc-container").first(),
    timesSection: root.getByText(
      new RegExp(
        getEnglishText("i18n.components.modal_event_details.daily_times"),
        "i"
      )
    ),

    // MARK: Helpers
    allDayCheckbox(index: number): Locator {
      return root.locator(`input[data-testid='all-day-long-event-${index}']`);
    },

    startTimeField(index: number | string): Locator {
      return root.locator(`[id="form-item-times.${index}.startTime"]`);
    },

    endTimeField(index: number | string): Locator {
      return root.locator(`[id="form-item-times.${index}.endTime"]`);
    },

    calendarDayButtons(): Locator {
      return root.locator(".vc-day.in-month .vc-day-content[role='button']");
    },
  };
};

export type EventDetailsEditModal = ReturnType<typeof newEventDetailsEditModal>;
