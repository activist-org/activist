// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "#shared/utils/i18n";

import { newCreateDropdown } from "~/test-e2e/component-objects/CreateDropdown";
import { newCreateOrganizationModal } from "~/test-e2e/component-objects/CreateOrganizationModal";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { newSidebarRight } from "~/test-e2e/component-objects/SidebarRight";
import { expect, test } from "~/test-e2e/global-fixtures";

test.describe(
  "Organization Create Modal - Form Validation",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/home");
      await page.waitForURL("**/home**");

      const viewportSize = page.viewportSize();
      const isMobileLayout = viewportSize ? viewportSize.width < 768 : false;

      if (isMobileLayout) {
        const sidebarRight = newSidebarRight(page);
        await sidebarRight.openButton.click();
        await expect(sidebarRight.closeButton).toBeVisible();
        const createDropdown = newCreateDropdown(page, {
          root: page.locator("#drawer-navigation"),
        });
        await createDropdown.clickNewOrganization();
      } else {
        await expect(page.locator("#sidebar-left")).toBeVisible({
          timeout: 15000,
        });
        const sidebarLeft = newSidebarLeft(page);
        await sidebarLeft.open();
        const createDropdown = newCreateDropdown(page);
        await createDropdown.clickNewOrganization();
      }

      const modal = newCreateOrganizationModal(page);
      await expect(modal.root).toBeVisible();
      await expect(modal.detailsForm).toBeVisible();
    });

    // MARK: Empty submission

    test("submitting empty step 1 shows inline errors for all required fields", async ({
      page,
    }) => {
      const modal = newCreateOrganizationModal(page);

      await modal.getNextStepButton().click();

      await expect(modal.detailsForm).toBeVisible();
      await expect(modal.nameError).toBeVisible();
      await expect(modal.descriptionError).toBeVisible();

      const requiredText = getEnglishText("i18n._global.required");
      await expect(modal.nameError).toContainText(requiredText);
      await expect(modal.descriptionError).toContainText(requiredText);
    });

    // MARK: Partial submission

    test("filling only name leaves error on description", async ({ page }) => {
      const modal = newCreateOrganizationModal(page);

      await modal.nameField.fill("E2E Partial Org");
      await modal.getNextStepButton().click();

      await expect(modal.detailsForm).toBeVisible();
      await expect(modal.nameError).not.toBeVisible();
      await expect(modal.descriptionError).toBeVisible();
    });

    // MARK: Correction

    test("correcting all errors allows advancing to location step", async ({
      page,
    }) => {
      const modal = newCreateOrganizationModal(page);

      await modal.getNextStepButton().click();
      await expect(modal.nameError).toBeVisible();

      await modal.nameField.fill("E2E Corrected Org");
      await modal.descriptionField.fill("Corrected description.");

      await modal.getNextStepButton().click({ force: true });

      await expect(modal.locationForm).toBeVisible();
      await expect(modal.nameError).not.toBeVisible();
      await expect(modal.descriptionError).not.toBeVisible();
    });

    // MARK: Location step - empty submission

    test("submitting empty location step shows country and city errors", async ({
      page,
    }) => {
      const modal = newCreateOrganizationModal(page);

      await modal.nameField.fill("E2E Location Validation Org");
      await modal.descriptionField.fill("Location validation test.");
      await modal.getNextStepButton().click({ force: true });

      await expect(modal.locationForm).toBeVisible();

      await modal.submitLocationButton.click();

      await expect(modal.locationForm).toBeVisible();
      await expect(modal.countryError).toBeVisible();
      await expect(modal.cityError).toBeVisible();
    });

    // MARK: Location step - clear selected country with X button

    test("clearing a selected country with the X button shows the required error", async ({
      page,
    }) => {
      const modal = newCreateOrganizationModal(page);

      await modal.nameField.fill("E2E Clear Country Org");
      await modal.descriptionField.fill("Clear country test.");
      await modal.getNextStepButton().click({ force: true });

      await expect(modal.locationForm).toBeVisible();

      const countryComboboxButton = modal.locationForm.getByRole("button", {
        name: new RegExp(getEnglishText("i18n._global.country"), "i"),
      });
      await countryComboboxButton.click();
      const firstCountryOption = modal.root.getByRole("option").first();
      await expect(firstCountryOption).toBeVisible({ timeout: 10000 });
      await firstCountryOption.click();
      await expect(modal.countryError).not.toBeVisible();

      // Wait for the selected country name to appear in the input before the
      // X icon renders, then dispatch the click directly on the icon span
      // (CSS icons have pointer-events: none, so regular .click() misses them).
      await expect(modal.countryField).not.toHaveValue("", { timeout: 5000 });
      await countryComboboxButton.locator("span").dispatchEvent("click");

      await modal.cityField.fill("Berlin");
      await modal.submitLocationButton.click();

      // Country was cleared - error must use the "Required" message,
      // not "Expected string, received null" (the bug before the fix).
      await expect(modal.countryError).toBeVisible();
      await expect(modal.countryError).toContainText("required", {
        ignoreCase: true,
      });
    });

    // MARK: Location step - typed text without selection

    test("typing in country field without selecting from list still shows country error", async ({
      page,
    }) => {
      const modal = newCreateOrganizationModal(page);

      await modal.nameField.fill("E2E Country Partial Org");
      await modal.descriptionField.fill("Country partial validation.");
      await modal.getNextStepButton().click({ force: true });

      await expect(modal.locationForm).toBeVisible();

      // Typed text filters the dropdown but does not commit a form value.
      await modal.countryField.fill("Germ");
      await modal.cityField.fill("Berlin");
      await modal.submitLocationButton.click();

      // Typed text ≠ valid selection: country error must still appear.
      await expect(modal.locationForm).toBeVisible();
      await expect(modal.countryError).toBeVisible();
      await expect(modal.cityError).not.toBeVisible();
    });
  }
);
