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
  await modal.nameField.fill("E2E Time Validation Event");
  await modal.descriptionField.fill("Time step validation test.");
  await selectFirstOrganization(modal);
  await modal.getNextStepButton().click({ force: true });

  await expect(modal.eventTypeForm).toBeVisible();
  await modal.locationTypeSection
    .getByRole("radio", { name: /online/i })
    .click();
  await modal.eventTypeSection.getByRole("radio", { name: /learn/i }).click();
  await selectFirstTopic(modal);
  await modal.getNextStepButton().click({ force: true });

  await expect(modal.linkOnlineForm).toBeVisible();
  await modal.onlineLinkField.fill("https://example.com/time-validation");
  await modal.getNextStepButton().click();

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

      await expect(modal.eventDetailsForm).toBeVisible();
      await expect(modal.nameError).toBeVisible();
      await expect(modal.descriptionError).toBeVisible();
      await expect(modal.orgsError).toBeVisible();

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

      await expect(modal.eventDetailsForm).toBeVisible();
      await expect(modal.nameError).not.toBeVisible();
      await expect(modal.descriptionError).toBeVisible();
      await expect(modal.orgsError).toBeVisible();
    });

    // MARK: Event type step (step 2) - empty submission

    test("submitting empty event type step shows errors for all required fields", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);

      await modal.nameField.fill("E2E Event Type Validation");
      await modal.descriptionField.fill("Event type step validation test.");
      await selectFirstOrganization(modal);
      await modal.getNextStepButton().click({ force: true });

      await expect(modal.eventTypeForm).toBeVisible();
      await modal.getNextStepButton().click();

      await expect(modal.eventTypeForm).toBeVisible();
      await expect(modal.settingError).toBeVisible();
      await expect(modal.typeError).toBeVisible();
      await expect(modal.topicsError).toBeVisible();

      const requiredText = getEnglishText("i18n._global.required");
      await expect(modal.settingError).toContainText(requiredText);
      await expect(modal.typeError).toContainText(requiredText);
      await expect(modal.topicsError).toContainText(requiredText);
    });

    // MARK: Event type step (step 2) - partial submission

    test("selecting only location type leaves event type and topics errors", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);

      await modal.nameField.fill("E2E Event Type Partial");
      await modal.descriptionField.fill("Event type partial validation.");
      await selectFirstOrganization(modal);
      await modal.getNextStepButton().click({ force: true });

      await expect(modal.eventTypeForm).toBeVisible();
      await modal.locationTypeSection
        .getByRole("radio", { name: /online/i })
        .click();
      await modal.getNextStepButton().click();

      await expect(modal.eventTypeForm).toBeVisible();
      await expect(modal.settingError).not.toBeVisible();
      await expect(modal.typeError).toBeVisible();
      await expect(modal.topicsError).toBeVisible();
    });

    // MARK: Event type step (step 2) - topics type-without-select

    test("typing in topics field without selecting still shows required error", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);

      await modal.nameField.fill("E2E Topics Partial");
      await modal.descriptionField.fill("Topics partial validation.");
      await selectFirstOrganization(modal);
      await modal.getNextStepButton().click({ force: true });

      await expect(modal.eventTypeForm).toBeVisible();

      await modal.locationTypeSection
        .getByRole("radio", { name: /online/i })
        .click();
      await modal.eventTypeSection
        .getByRole("radio", { name: /learn/i })
        .click();

      // Typed text filters the dropdown but does not commit a selection.
      await modal.topicsCombobox.locator("input").fill("some topic");

      await modal.getNextStepButton().click();

      await expect(modal.eventTypeForm).toBeVisible();
      await expect(modal.settingError).not.toBeVisible();
      await expect(modal.typeError).not.toBeVisible();
      await expect(modal.topicsError).toBeVisible();
      const requiredText = getEnglishText("i18n._global.required");
      await expect(modal.topicsError).toContainText(requiredText);
    });

    // MARK: Link step - invalid URL format

    test("entering an invalid URL in the link step shows format error", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);

      await modal.nameField.fill("E2E URL Validation Event");
      await modal.descriptionField.fill("URL format validation test.");
      await selectFirstOrganization(modal);
      await modal.getNextStepButton().click({ force: true });

      await expect(modal.eventTypeForm).toBeVisible();
      await modal.locationTypeSection
        .getByRole("radio", { name: /online/i })
        .click();
      await modal.eventTypeSection
        .getByRole("radio", { name: /learn/i })
        .click();
      await selectFirstTopic(modal);
      await modal.getNextStepButton().click({ force: true });

      await expect(modal.linkOnlineForm).toBeVisible();
      await modal.onlineLinkField.fill("not-a-url");
      await modal.getNextStepButton().click();

      await expect(modal.linkOnlineForm).toBeVisible();
      await expect(modal.onlineLinkError).toBeVisible();
      await expect(modal.onlineLinkError).toContainText(/valid url/i);
    });

    // MARK: Time step validation

    test("submitting time step without selecting dates shows date error", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);
      await navigateToTimeStep(modal);

      await modal.getNextStepButton().click();

      await expect(modal.timeForm).toBeVisible();
      await expect(modal.datesError).toBeVisible();
    });

    // MARK: Correction

    test("correcting all errors allows advancing past step 1", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);

      await modal.getNextStepButton().click();
      await expect(modal.nameError).toBeVisible();

      await modal.nameField.fill("E2E Corrected Event");
      await modal.descriptionField.fill("Corrected description.");
      await selectFirstOrganization(modal);

      await modal.getNextStepButton().click({ force: true });

      await expect(modal.eventDetailsForm).not.toBeVisible();
      await expect(modal.nameError).not.toBeVisible();
      await expect(modal.descriptionError).not.toBeVisible();
      await expect(modal.orgsError).not.toBeVisible();
    });
  }
);
