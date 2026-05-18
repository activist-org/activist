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

      // Modal stays on step 1 - no entity was created.
      await expect(modal.detailsForm).toBeVisible();

      // Both required fields show inline error messages.
      await expect(modal.nameError).toBeVisible();
      await expect(modal.descriptionError).toBeVisible();

      // Errors contain the expected "Required" text.
      const requiredText = getEnglishText("i18n._global.required");
      await expect(modal.nameError).toContainText(requiredText);
      await expect(modal.descriptionError).toContainText(requiredText);
    });

    // MARK: Partial submission

    test("filling only name leaves error on description", async ({ page }) => {
      const modal = newCreateOrganizationModal(page);

      await modal.nameField.fill("E2E Partial Org");
      await modal.getNextStepButton().click();

      // Still on step 1.
      await expect(modal.detailsForm).toBeVisible();

      // Name is valid - no error for it.
      await expect(modal.nameError).not.toBeVisible();

      // Description still required.
      await expect(modal.descriptionError).toBeVisible();
    });

    // MARK: Correction

    test("correcting all errors allows advancing to location step", async ({
      page,
    }) => {
      const modal = newCreateOrganizationModal(page);

      // Trigger validation errors first.
      await modal.getNextStepButton().click();
      await expect(modal.nameError).toBeVisible();

      // Fill all required fields.
      await modal.nameField.fill("E2E Corrected Org");
      await modal.descriptionField.fill("Corrected description.");

      await modal.getNextStepButton().click({ force: true });

      // Advanced to step 2 - no inline errors remain.
      await expect(modal.locationForm).toBeVisible();
      await expect(modal.nameError).not.toBeVisible();
      await expect(modal.descriptionError).not.toBeVisible();
    });
  }
);
