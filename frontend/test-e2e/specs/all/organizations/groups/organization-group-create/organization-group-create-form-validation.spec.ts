// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "#shared/utils/i18n";

import { newCreateDropdown } from "~/test-e2e/component-objects/CreateDropdown";
import { newCreateGroupModal } from "~/test-e2e/component-objects/CreateGroupModal";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { newSidebarRight } from "~/test-e2e/component-objects/SidebarRight";
import { expect, test } from "~/test-e2e/global-fixtures";

const orgsLabel = getEnglishText("i18n._global.organization");

async function selectFirstOrganization(
  modal: ReturnType<typeof newCreateGroupModal>
) {
  const orgsButton = modal.organizationCombobox.getByRole("button", {
    name: new RegExp(orgsLabel, "i"),
  });
  await orgsButton.click();
  const firstOption = modal.root.getByRole("option").first();
  await expect(firstOption).toBeVisible({ timeout: 10000 });
  await firstOption.click();
  await expect(modal.root.getByRole("option").first()).toBeHidden({
    timeout: 5000,
  });
}

test.describe(
  "Group Create Modal - Form Validation",
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
        await createDropdown.clickNewGroup();
      } else {
        await expect(page.locator("#sidebar-left")).toBeVisible({
          timeout: 15000,
        });
        const sidebarLeft = newSidebarLeft(page);
        await sidebarLeft.open();
        const createDropdown = newCreateDropdown(page);
        await createDropdown.clickNewGroup();
      }

      const modal = newCreateGroupModal(page);
      await expect(modal.root).toBeVisible();
      await expect(modal.detailsForm).toBeVisible();
    });

    // MARK: Empty submission

    test("submitting empty step 1 shows inline errors for all required fields", async ({
      page,
    }) => {
      const modal = newCreateGroupModal(page);

      await modal.getNextStepButton().click();

      await expect(modal.detailsForm).toBeVisible();
      await expect(modal.nameError).toBeVisible();
      await expect(modal.descriptionError).toBeVisible();
      await expect(modal.organizationError).toBeVisible();

      const requiredText = getEnglishText("i18n._global.required");
      await expect(modal.nameError).toContainText(requiredText);
      await expect(modal.descriptionError).toContainText(requiredText);
    });

    // MARK: Partial submission

    test("filling only name leaves errors on description and organization", async ({
      page,
    }) => {
      const modal = newCreateGroupModal(page);

      await modal.nameField.fill("E2E Partial Group");
      await modal.getNextStepButton().click();

      await expect(modal.detailsForm).toBeVisible();
      await expect(modal.nameError).not.toBeVisible();
      await expect(modal.descriptionError).toBeVisible();
      await expect(modal.organizationError).toBeVisible();
    });

    // MARK: Organization - typed text without selection

    test("typing in organization field without selecting from list still shows required error", async ({
      page,
    }) => {
      const modal = newCreateGroupModal(page);

      await modal.nameField.fill("E2E Org Partial Group");
      await modal.descriptionField.fill("Org partial validation.");

      // Typed text filters the dropdown but does not commit a form value.
      await modal.organizationCombobox.locator("input").fill("Nonexistent Org");

      await modal.getNextStepButton().click();

      // Typed text ≠ valid selection: org error must still appear.
      await expect(modal.detailsForm).toBeVisible();
      await expect(modal.organizationError).toBeVisible();
      const requiredText = getEnglishText("i18n._global.required");
      await expect(modal.organizationError).toContainText(requiredText);
    });

    // MARK: Organization clear button

    test("clearing a selected organization with the X button shows the required error", async ({
      page,
    }) => {
      const modal = newCreateGroupModal(page);

      await selectFirstOrganization(modal);

      // Wait for the selection to be reflected: the combobox input must show
      // the org name (non-empty) before the X icon renders.
      const orgInput = modal.organizationCombobox.locator("input");
      await expect(orgInput).not.toHaveValue("", { timeout: 5000 });

      // The X icon inside ComboboxButton renders as a CSS <span> with
      // pointer-events: none, so a normal .click() on the button dispatches
      // to the button element, not the icon span. Use dispatchEvent to fire
      // the click directly on the icon element so the Vue handler fires.
      const orgComboboxButton = modal.organizationCombobox.getByRole("button", {
        name: new RegExp(getEnglishText("i18n._global.organization"), "i"),
      });
      await orgComboboxButton.locator("span").dispatchEvent("click");

      await expect(orgInput).toHaveValue("", { timeout: 5000 });

      await modal.nameField.fill("E2E Clear Org Group");
      await modal.descriptionField.fill("Clear org test.");
      await modal.getNextStepButton().click();

      // Organization was cleared - error must appear with the "Required" message,
      // not "Expected string, received null" (which was the bug before the fix).
      await expect(modal.organizationError).toBeVisible();
      const requiredText = getEnglishText("i18n._global.required");
      await expect(modal.organizationError).toContainText(requiredText);
    });

    // MARK: Correction

    test("correcting all errors allows advancing to location step", async ({
      page,
    }) => {
      const modal = newCreateGroupModal(page);

      await modal.getNextStepButton().click();
      await expect(modal.nameError).toBeVisible();

      await modal.nameField.fill("E2E Corrected Group");
      await modal.descriptionField.fill("Corrected description.");
      await selectFirstOrganization(modal);

      await modal.getNextStepButton().click({ force: true });

      await expect(modal.locationForm).toBeVisible();
      await expect(modal.nameError).not.toBeVisible();
      await expect(modal.descriptionError).not.toBeVisible();
      await expect(modal.organizationError).not.toBeVisible();
    });

    // MARK: Location step - country field non-interactive

    test("group location country field is disabled and non-interactive", async ({
      page,
    }) => {
      const modal = newCreateGroupModal(page);

      await modal.nameField.fill("E2E Country Disabled Group");
      await modal.descriptionField.fill("Country disabled validation.");
      await selectFirstOrganization(modal);
      await modal.getNextStepButton().click({ force: true });

      await expect(modal.locationForm).toBeVisible();
      // Wait for the org's country to be auto-filled.
      await expect(modal.countryField).not.toHaveValue("", { timeout: 15000 });

      const countryValue = await modal.countryField.inputValue();

      // The input is disabled - inherited from the org, not user-editable.
      await expect(modal.countryField).toBeDisabled();
      const countryComboboxButton = modal.locationForm.getByRole("button", {
        name: new RegExp(
          getEnglishText("i18n.components._global.country"),
          "i"
        ),
      });
      await countryComboboxButton.click({ force: true });
      await expect(modal.countryField).toHaveValue(countryValue);

      await modal.cityField.fill("Berlin");
      await modal.submitLocationButton.click();

      await expect(modal.countryError).not.toBeVisible();
      await expect(modal.countryField).toHaveValue(countryValue);
    });

    // MARK: Location step - empty city
    // Note: The group's country field is always disabled (inherited from the
    // selected org and non-editable). Only the city field can be validated.

    test("submitting location step without city shows city error", async ({
      page,
    }) => {
      const modal = newCreateGroupModal(page);

      await modal.nameField.fill("E2E City Validation Group");
      await modal.descriptionField.fill("City validation test.");
      await selectFirstOrganization(modal);
      await modal.getNextStepButton().click({ force: true });

      await expect(modal.locationForm).toBeVisible();
      // Wait for any auto-fill from the selected org to complete.
      await expect(modal.countryField).not.toHaveValue("", { timeout: 15000 });

      await modal.cityField.fill("");
      await modal.submitLocationButton.click();

      await expect(modal.locationForm).toBeVisible();
      await expect(modal.cityError).toBeVisible();
    });
  }
);
