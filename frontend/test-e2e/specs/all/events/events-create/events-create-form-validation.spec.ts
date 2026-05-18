// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "#shared/utils/i18n";

import { newCreateDropdown } from "~/test-e2e/component-objects/CreateDropdown";
import { newCreateEventModal } from "~/test-e2e/component-objects/CreateEventModal";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { newSidebarRight } from "~/test-e2e/component-objects/SidebarRight";
import { expect, test } from "~/test-e2e/global-fixtures";

// Event orgs field is a multi-select combobox (plural label).
const orgsLabel = getEnglishText("i18n._global.organizations");
const topicsLabel = getEnglishText("i18n.components._global.topics");

async function selectFirstOrganization(
  modal: ReturnType<typeof newCreateEventModal>
) {
  const orgsButton = modal.orgsCombobox.getByRole("button", {
    name: new RegExp(orgsLabel, "i"),
  });
  await orgsButton.click();
  const firstOption = modal.root.getByRole("option").first();
  await expect(firstOption).toBeVisible({ timeout: 10000 });
  await firstOption.click();
  // Multi-select keeps the dropdown open; close it by clicking the button again.
  await orgsButton.click();
  await expect(modal.root.getByRole("option").first()).toBeHidden({
    timeout: 5000,
  });
}

async function selectFirstTopic(modal: ReturnType<typeof newCreateEventModal>) {
  const topicsButton = modal.topicsCombobox.getByRole("button", {
    name: new RegExp(topicsLabel, "i"),
  });
  await topicsButton.click();
  const firstOption = modal.root.getByRole("option").first();
  await expect(firstOption).toBeVisible({ timeout: 10000 });
  await firstOption.click();
  await topicsButton.click();
  await expect(modal.root.getByRole("option").first()).toBeHidden({
    timeout: 5000,
  });
}

/** Navigate through steps 1-3 to land on the time step (step 4, online path). */
async function navigateToTimeStep(
  modal: ReturnType<typeof newCreateEventModal>
) {
  // Step 1: details.
  await modal.nameField.fill("E2E Time Validation Event");
  await modal.descriptionField.fill("Time step validation test.");
  await selectFirstOrganization(modal);
  await modal.getNextStepButton().click({ force: true });

  // Step 2: event type - select online, event type, and topic (all required).
  await expect(modal.eventTypeForm).toBeVisible();
  await modal.locationTypeSection
    .getByRole("radio", { name: /online/i })
    .click();
  await modal.eventTypeSection.getByRole("radio", { name: /learn/i }).click();
  await selectFirstTopic(modal);
  await modal.getNextStepButton().click({ force: true });

  // Step 3: link online.
  await expect(modal.linkOnlineForm).toBeVisible();
  await modal.onlineLinkField.fill("https://example.com/time-validation");
  await modal.getNextStepButton().click();

  // Now on step 4: time.
  await expect(modal.timeForm).toBeVisible();
}

test.describe(
  "Event Create Modal - Form Validation",
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
        await createDropdown.clickNewEvent();
      } else {
        await expect(page.locator("#sidebar-left")).toBeVisible({
          timeout: 15000,
        });
        const sidebarLeft = newSidebarLeft(page);
        await sidebarLeft.open();
        const createDropdown = newCreateDropdown(page);
        await createDropdown.clickNewEvent();
      }

      const modal = newCreateEventModal(page);
      await expect(modal.root).toBeVisible();
      await expect(modal.eventDetailsForm).toBeVisible();
    });

    // MARK: Empty submission

    test("submitting empty step 1 shows inline errors for all required fields", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);

      await modal.getNextStepButton().click();

      // Modal stays on step 1 - no entity was created.
      await expect(modal.eventDetailsForm).toBeVisible();

      // All required fields show inline error messages.
      await expect(modal.nameError).toBeVisible();
      await expect(modal.descriptionError).toBeVisible();
      await expect(modal.orgsError).toBeVisible();

      // Errors contain the expected "Required" text.
      const requiredText = getEnglishText("i18n._global.required");
      await expect(modal.nameError).toContainText(requiredText);
      await expect(modal.descriptionError).toContainText(requiredText);
    });

    // MARK: Partial submission

    test("filling only name leaves errors on description and organization", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);

      await modal.nameField.fill("E2E Partial Event");
      await modal.getNextStepButton().click();

      // Still on step 1.
      await expect(modal.eventDetailsForm).toBeVisible();

      // Name is valid - no error for it.
      await expect(modal.nameError).not.toBeVisible();

      // Remaining required fields still show errors.
      await expect(modal.descriptionError).toBeVisible();
      await expect(modal.orgsError).toBeVisible();
    });

    // MARK: Time step validation

    test("submitting time step without selecting dates shows date error", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);
      await navigateToTimeStep(modal);

      await modal.getNextStepButton().click();

      // Time form stays visible - no event was created.
      await expect(modal.timeForm).toBeVisible();

      // Dates field shows inline error.
      await expect(modal.datesError).toBeVisible();
    });

    // MARK: Correction

    test("correcting all errors allows advancing past step 1", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);

      // Trigger validation errors first.
      await modal.getNextStepButton().click();
      await expect(modal.nameError).toBeVisible();

      // Fill all required fields.
      await modal.nameField.fill("E2E Corrected Event");
      await modal.descriptionField.fill("Corrected description.");
      await selectFirstOrganization(modal);

      await modal.getNextStepButton().click({ force: true });

      // Advanced past step 1 - details form is no longer the active step.
      await expect(modal.eventDetailsForm).not.toBeVisible();
      await expect(modal.nameError).not.toBeVisible();
      await expect(modal.descriptionError).not.toBeVisible();
      await expect(modal.orgsError).not.toBeVisible();
    });
  }
);
