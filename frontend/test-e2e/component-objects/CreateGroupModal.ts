// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";

import { getEnglishText } from "#shared/utils/i18n";
import { expect } from "@playwright/test";

export const newCreateGroupModal = (page: Page) => {
  const root = page.getByTestId("modal-ModalCreateGroup");
  const organizationCombobox = root.locator("#form-item-organization");
  const orgsLabel = getEnglishText("i18n._global.organization");

  return {
    // MARK: Public Locators
    root,
    closeButton: root.getByTestId("modal-close-button"),

    // MARK: Details
    detailsForm: root.locator("#group-details"),
    nameField: root.locator("#form-item-name"),
    taglineField: root.locator("#form-item-tagline"),
    descriptionField: root.locator("#form-item-description"),
    organizationCombobox,

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

    // MARK: Actions

    /**
     * Open the organization combobox and select the first available option.
     *
     * The combobox loads its options asynchronously, so two races can occur:
     * the open click can land before the panel is interactive (leaving it
     * closed), and the organization fetch can resolve after the panel opens
     * (notably on mobile CI), so no option has rendered yet. Retry the whole
     * open-and-wait, clicking only while the button is collapsed so an
     * already-open panel is never toggled shut, until an option appears.
     */
    async selectFirstOrganization(): Promise<void> {
      const orgsButton = organizationCombobox.getByRole("button", {
        name: new RegExp(orgsLabel, "i"),
      });
      const firstOption = root.getByRole("option").first();

      await expect(async () => {
        if ((await orgsButton.getAttribute("aria-expanded")) !== "true") {
          await orgsButton.click();
        }
        await expect(firstOption).toBeVisible({ timeout: 2000 });
      }).toPass({ timeout: 20000 });

      await firstOption.click();
      // Single-select closes the dropdown automatically after a choice.
      await expect(firstOption).toBeHidden({ timeout: 5000 });
      // Ensure the selected value is committed to form state before callers
      // proceed; the option-click to vee-validate update is slightly async
      // (notably on mobile) and can otherwise race the next-step click.
      await expect(organizationCombobox.locator("input")).not.toHaveValue("", {
        timeout: 5000,
      });
    },
  };
};

export type CreateGroupModal = ReturnType<typeof newCreateGroupModal>;
