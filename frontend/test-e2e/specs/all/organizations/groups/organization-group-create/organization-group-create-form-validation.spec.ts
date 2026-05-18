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

      // Modal stays on step 1 - no entity was created.
      await expect(modal.detailsForm).toBeVisible();

      // All three required fields show inline error messages.
      await expect(modal.nameError).toBeVisible();
      await expect(modal.descriptionError).toBeVisible();
      await expect(modal.organizationError).toBeVisible();

      // Errors contain the expected "Required" text.
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

      // Still on step 1.
      await expect(modal.detailsForm).toBeVisible();

      // Name is valid - no error for it.
      await expect(modal.nameError).not.toBeVisible();

      // Remaining required fields still show errors.
      await expect(modal.descriptionError).toBeVisible();
      await expect(modal.organizationError).toBeVisible();
    });

    // MARK: Correction

    test("correcting all errors allows advancing to location step", async ({
      page,
    }) => {
      const modal = newCreateGroupModal(page);

      // Trigger validation errors first.
      await modal.getNextStepButton().click();
      await expect(modal.nameError).toBeVisible();

      // Fill all required fields.
      await modal.nameField.fill("E2E Corrected Group");
      await modal.descriptionField.fill("Corrected description.");
      await selectFirstOrganization(modal);

      await modal.getNextStepButton().click({ force: true });

      // Advanced to step 2 - no inline errors remain.
      await expect(modal.locationForm).toBeVisible();
      await expect(modal.nameError).not.toBeVisible();
      await expect(modal.descriptionError).not.toBeVisible();
      await expect(modal.organizationError).not.toBeVisible();
    });
  }
);
