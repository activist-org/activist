// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "#shared/utils/i18n";

import { runAccessibilityTestScoped } from "~/test-e2e/accessibility/accessibilityTesting";
import { newCreateDropdown } from "~/test-e2e/component-objects/CreateDropdown";
import { newCreateEventModal } from "~/test-e2e/component-objects/CreateEventModal";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { newSidebarRight } from "~/test-e2e/component-objects/SidebarRight";
import { expect, test } from "~/test-e2e/global-fixtures";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

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
    await expect(page.locator("#sidebar-left")).toBeVisible({ timeout: 15000 });
    const sidebarLeft = newSidebarLeft(page);
    await sidebarLeft.open();
    const createDropdown = newCreateDropdown(page);
    await createDropdown.clickNewEvent();
  }
});

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

// Set each day's start time to 10:00 and end time to 11:00.
// Backend receives start_time < end_time for every entry.
async function setFirstDayEndTimeToFuture(
  modal: ReturnType<typeof newCreateEventModal>,
  page: {
    keyboard: {
      press: (key: string) => Promise<void>;
      type: (text: string) => Promise<void>;
    };
  }
) {
  // v-calendar renders a div, not a native input; use click + keyboard to type (24h).
  // When multiple days are selected we have times.0, times.1, ...; all must have start < end.
  const timeEntries = await modal.timeForm
    .locator('[id^="form-item-times."]')
    .all();
  const indices = new Set<string>();
  for (const el of timeEntries) {
    const id = await el.getAttribute("id");
    const m = id?.match(/form-item-times\.(\d+)\.(startTime|endTime)/);
    if (m?.[1]) indices.add(m[1]);
  }
  for (const idx of Array.from(indices).sort()) {
    const startContainer = modal.timeForm.locator(
      `[id="form-item-times.${idx}.startTime"]`
    );
    await startContainer.click();
    await page.keyboard.press("Control+a");
    await page.keyboard.type("10:00");
    const endContainer = modal.timeForm.locator(
      `[id="form-item-times.${idx}.endTime"]`
    );
    await endContainer.click();
    await page.keyboard.press("Control+a");
    await page.keyboard.type("11:00");
  }
}

/** Axe scope: open create-event dialog (`CreateEventModal` root). */
const MODAL_A11Y_ROOT = '[data-testid="modal-ModalCreateEvent"]';

async function goToEventTypeStep(
  modal: ReturnType<typeof newCreateEventModal>
) {
  await modal.nameField.fill("A11y navigate step 2");
  await modal.descriptionField.fill("Accessibility scan step navigation.");
  await selectFirstOrganization(modal);
  await modal.getNextStepButton().click({ force: true });
  await expect(modal.eventTypeForm).toBeVisible();
}

async function goToLinkOnlineStep(
  modal: ReturnType<typeof newCreateEventModal>
) {
  await goToEventTypeStep(modal);
  await modal.locationTypeSection
    .getByRole("radio", { name: /online/i })
    .click();
  await modal.eventTypeSection.getByRole("radio", { name: /learn/i }).click();
  await selectFirstTopic(modal);
  await modal.getNextStepButton().click({ force: true });
  await expect(modal.linkOnlineForm).toBeVisible();
}

async function goToTimeStep(modal: ReturnType<typeof newCreateEventModal>) {
  await goToLinkOnlineStep(modal);
  await modal.onlineLinkField.fill("https://example.com/a11y-scan");
  await modal.getNextStepButton().click();
  await expect(modal.timeForm).toBeVisible();
}

async function goToPhysicalLocationStep(
  modal: ReturnType<typeof newCreateEventModal>
) {
  await modal.nameField.fill("A11y physical location step");
  await modal.descriptionField.fill("Accessibility scan physical path.");
  await selectFirstOrganization(modal);
  await modal.getNextStepButton().click({ force: true });
  await modal.locationTypeSection
    .getByRole("radio", { name: /physical/i })
    .click();
  await modal.eventTypeSection.getByRole("radio", { name: /learn/i }).click();
  await selectFirstTopic(modal);
  await modal.getNextStepButton().click({ force: true });
  await expect(modal.locationForm).toBeVisible();
}

test.describe(
  "Event Create Modal",
  { tag: ["@desktop", "@mobile", "@all"] },
  () => {
    // MARK: Modal opens

    test("modal opens with correct heading", async ({ page }) => {
      const modal = newCreateEventModal(page);
      await expect(modal.root).toBeVisible();
      await expect(
        modal.root.getByRole("heading", {
          level: 2,
          name: new RegExp(
            getEnglishText(
              "i18n.components.modal_create_event.create_new_event"
            ),
            "i"
          ),
        })
      ).toBeVisible();
    });

    // MARK: Accessibility by wizard step (modal subtree only)

    test.describe("Event Create Modal accessibility by step", () => {
      test.setTimeout(120000);

      test(
        "step 1 event details has no detectable accessibility issues in modal",
        { tag: "@accessibility" },
        async ({ page }, testInfo) => {
          logTestPath(testInfo);
          const modal = newCreateEventModal(page);
          await expect(modal.eventDetailsForm).toBeVisible();

          await withTestStep(
            testInfo,
            "axe modal — step 1 details",
            async () => {
              const violations = await runAccessibilityTestScoped(
                "Event Create Modal step 1 event details",
                page,
                testInfo,
                MODAL_A11Y_ROOT
              );
              expect
                .soft(violations, "Accessibility violations (step 1):")
                .toHaveLength(0);
            }
          );
        }
      );

      test(
        "step 2 event type has no detectable accessibility issues in modal",
        { tag: "@accessibility" },
        async ({ page }, testInfo) => {
          logTestPath(testInfo);
          const modal = newCreateEventModal(page);
          await goToEventTypeStep(modal);

          await withTestStep(
            testInfo,
            "axe modal — step 2 event type",
            async () => {
              const violations = await runAccessibilityTestScoped(
                "Event Create Modal step 2 event type",
                page,
                testInfo,
                MODAL_A11Y_ROOT
              );
              expect
                .soft(violations, "Accessibility violations (step 2):")
                .toHaveLength(0);
            }
          );
        }
      );

      test(
        "step 3 link online has no detectable accessibility issues in modal",
        { tag: "@accessibility" },
        async ({ page }, testInfo) => {
          logTestPath(testInfo);
          const modal = newCreateEventModal(page);
          await goToLinkOnlineStep(modal);

          await withTestStep(
            testInfo,
            "axe modal — step 3 link online",
            async () => {
              const violations = await runAccessibilityTestScoped(
                "Event Create Modal step 3 link online",
                page,
                testInfo,
                MODAL_A11Y_ROOT
              );
              expect
                .soft(violations, "Accessibility violations (step 3 online):")
                .toHaveLength(0);
            }
          );
        }
      );

      test(
        "step 3 physical location has no detectable accessibility issues in modal",
        { tag: "@accessibility" },
        async ({ page }, testInfo) => {
          logTestPath(testInfo);
          const modal = newCreateEventModal(page);
          await goToPhysicalLocationStep(modal);

          await withTestStep(
            testInfo,
            "axe modal — step 3 physical location",
            async () => {
              const violations = await runAccessibilityTestScoped(
                "Event Create Modal step 3 physical location",
                page,
                testInfo,
                MODAL_A11Y_ROOT
              );
              expect
                .soft(violations, "Accessibility violations (step 3 physical):")
                .toHaveLength(0);
            }
          );
        }
      );

      test(
        "step 4 date and time has no detectable accessibility issues in modal",
        { tag: "@accessibility" },
        async ({ page }, testInfo) => {
          logTestPath(testInfo);
          const modal = newCreateEventModal(page);
          await goToTimeStep(modal);
          const dayButtons = modal.root.locator(
            ".vc-day.in-month .vc-day-content[role='button']"
          );
          await dayButtons.first().click();
          await dayButtons.nth(1).click();
          await setFirstDayEndTimeToFuture(modal, page);

          await withTestStep(testInfo, "axe modal — step 4 time", async () => {
            const violations = await runAccessibilityTestScoped(
              "Event Create Modal step 4 date and time",
              page,
              testInfo,
              MODAL_A11Y_ROOT,
              {
                // v-calendar: icon-only nav + unlabeled time <select>s.
                // Step 4 checkboxes/list markup also hit `label`/`list` until addressed in product code.
                disableRules: ["button-name", "select-name", "label", "list"],
              }
            );
            expect
              .soft(violations, "Accessibility violations (step 4):")
              .toHaveLength(0);
          });
        }
      );
    });

    // MARK: Step 1 validation

    test("step 1 shows validation when required fields are empty", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);
      await expect(modal.root).toBeVisible();
      await expect(modal.eventDetailsForm).toBeVisible();

      await modal.getNextStepButton().click();

      await expect(modal.eventDetailsForm).toBeVisible();
      await expect(modal.root).toBeVisible();
    });

    // MARK: Step 1 → 2

    test("step 1 to 2: filled details advance to event type step", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);
      await expect(modal.eventDetailsForm).toBeVisible();

      await modal.nameField.fill("E2E Test Event");
      await modal.descriptionField.fill("Description for E2E test.");

      await selectFirstOrganization(modal);

      await modal.getNextStepButton().click({ force: true });

      await expect(modal.eventTypeForm).toBeVisible();
      await expect(modal.locationTypeSection).toBeVisible();
    });

    // MARK: Previous button

    test("previous button returns to step 1 with data retained", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);
      await modal.nameField.fill("Retained Event Name");
      await modal.descriptionField.fill("Retained description.");
      await selectFirstOrganization(modal);
      await modal.getNextStepButton().click({ force: true });
      await expect(modal.eventTypeForm).toBeVisible();

      await modal.getPreviousStepButton().click();

      await expect(modal.eventDetailsForm).toBeVisible();
      await expect(modal.nameField).toHaveValue("Retained Event Name");
      await expect(modal.descriptionField).toHaveValue("Retained description.");
    });

    test("previous button retains rehydrated data on Event Type and Details when going back from Link Online", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);
      await modal.nameField.fill("Rehydration Test Event");
      await modal.descriptionField.fill("Testing step rehydration.");
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
      await modal.onlineLinkField.fill("https://example.com/rehydration-test");
      await modal.getPreviousStepButton().click();

      await expect(modal.eventTypeForm).toBeVisible();
      await expect(
        modal.locationTypeSection.getByRole("radio", { name: /online/i })
      ).toBeChecked();
      await expect(
        modal.eventTypeSection.getByRole("radio", { name: /learn/i })
      ).toBeChecked();

      await modal.getPreviousStepButton().click();

      await expect(modal.eventDetailsForm).toBeVisible();
      await expect(modal.nameField).toHaveValue("Rehydration Test Event");
      await expect(modal.descriptionField).toHaveValue(
        "Testing step rehydration."
      );
    });

    // Time step no longer retains data on Prev→Next (product decision); un-skip if restored.
    test.skip("Time step retains date and time after Previous then Next", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);
      await modal.nameField.fill("Time Persist Event");
      await modal.descriptionField.fill("Testing time step rehydration.");
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
      await modal.onlineLinkField.fill("https://example.com/time-persist-test");
      await modal.getNextStepButton().click();

      await expect(modal.timeForm).toBeVisible();
      const dayButtons = modal.root.locator(
        ".vc-day.in-month .vc-day-content[role='button']"
      );
      await dayButtons.first().click();
      await dayButtons.nth(1).click();
      await setFirstDayEndTimeToFuture(modal, page);

      await modal.getPreviousStepButton().click();
      await expect(modal.linkOnlineForm).toBeVisible();
      await modal.getNextStepButton().click();

      await expect(modal.timeForm).toBeVisible();
      await expect(
        modal.timeForm.locator('[id="form-item-times.0.startTime"]')
      ).toContainText("10");
      await expect(
        modal.timeForm.locator('[id="form-item-times.0.endTime"]')
      ).toContainText("11");
    });

    // MARK: Modal close

    test("modal close button hides modal", async ({ page }) => {
      const modal = newCreateEventModal(page);
      await expect(modal.root).toBeVisible();

      await modal.closeButton.click();

      await expect(modal.root).not.toBeVisible();
    });

    // MARK: Full flow (online)

    test("full flow (online event) closes modal on submit", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);

      await modal.nameField.fill("E2E Online Event");
      await modal.descriptionField.fill("Online event description.");
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
      await modal.onlineLinkField.fill("https://example.com/event");
      await modal.getNextStepButton().click();

      await expect(modal.timeForm).toBeVisible();
      const dayButtons = modal.root.locator(
        ".vc-day.in-month .vc-day-content[role='button']"
      );
      await dayButtons.first().click();
      await dayButtons.nth(1).click();
      await setFirstDayEndTimeToFuture(modal, page);
      await modal.getNextStepButton().click();

      await expect(modal.root).not.toBeVisible({ timeout: 15000 });
      await expect(page).toHaveURL(/\/events\/[^/]+\/about/, {
        timeout: 10000,
      });
    });

    // MARK: Full flow (online, all day)

    test("full flow (online event, all day) closes modal on submit", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);

      await modal.nameField.fill("E2E All Day Event");
      await modal.descriptionField.fill("All day event description.");
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
      await modal.onlineLinkField.fill("https://example.com/all-day-event");
      await modal.getNextStepButton().click();

      await expect(modal.timeForm).toBeVisible();
      const dayButtons = modal.root.locator(
        ".vc-day.in-month .vc-day-content[role='button']"
      );
      await dayButtons.first().click();
      await dayButtons.nth(1).click();
      const allDayCheckbox = modal.timeForm.locator(
        "input[data-testid='all-day-long-event-0']"
      );
      await allDayCheckbox.scrollIntoViewIfNeeded();
      await allDayCheckbox.check();
      // Second day (times.1) is not all-day; backend requires start_time < end_time for it.
      await setFirstDayEndTimeToFuture(modal, page);
      await modal.getNextStepButton().click();

      await expect(modal.root).not.toBeVisible({ timeout: 15000 });
      await expect(page).toHaveURL(/\/events\/[^/]+\/about/, {
        timeout: 10000,
      });
    });

    // MARK: Create Another checkbox flow

    test("create another checkbox returns to step 1 after submit and keeps modal open", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);

      await modal.nameField.fill("E2E First Event");
      await modal.descriptionField.fill("First event description.");
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
      await modal.onlineLinkField.fill(
        "https://example.com/create-another-test"
      );
      await modal.getNextStepButton().click();

      await expect(modal.timeForm).toBeVisible();
      const dayButtons = modal.root.locator(
        ".vc-day.in-month .vc-day-content[role='button']"
      );
      await dayButtons.first().click();
      await dayButtons.nth(1).click();
      await setFirstDayEndTimeToFuture(modal, page);
      // Time step and modal both scroll: bring bottom into view so "Create another" checkbox is visible.
      await modal.root.evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });
      await modal.timeForm.evaluate((form) => {
        const wrapper = form.parentElement;
        if (wrapper) wrapper.scrollTop = wrapper.scrollHeight;
      });
      const createAnotherCheckbox = modal.timeForm.locator(
        "input#form-item-createAnother"
      );
      await createAnotherCheckbox.scrollIntoViewIfNeeded();
      await createAnotherCheckbox.check();
      const submitBtn = modal.getNextStepButton();
      await submitBtn.scrollIntoViewIfNeeded();
      await submitBtn.click();

      await expect(modal.root).toBeVisible({ timeout: 15000 });
      await expect(modal.eventDetailsForm).toBeVisible();
      await expect(modal.nameField).toHaveValue("");
    });

    // MARK: Full flow (physical) – depends on location API

    test("full flow (physical event) closes modal on submit", async ({
      page,
    }) => {
      const modal = newCreateEventModal(page);

      await modal.nameField.fill("E2E Physical Event");
      await modal.descriptionField.fill("Physical event description.");
      await selectFirstOrganization(modal);
      await modal.getNextStepButton().click({ force: true });

      await expect(modal.eventTypeForm).toBeVisible();
      await modal.locationTypeSection
        .getByRole("radio", { name: /physical/i })
        .click();
      await modal.eventTypeSection
        .getByRole("radio", { name: /learn/i })
        .click();
      await selectFirstTopic(modal);
      await modal.getNextStepButton().click({ force: true });

      await expect(modal.locationForm).toBeVisible();
      const searchLocationForm = modal.root.locator("#search-location");
      const countryLabel = getEnglishText("i18n.components._global.country");
      const countryButton = searchLocationForm
        .locator("#form-item-country")
        .getByRole("button", { name: new RegExp(countryLabel, "i") });
      await countryButton.click();
      const germanyOption = modal.root.getByRole("option", {
        name: /Germany/i,
      });
      await expect(germanyOption).toBeVisible({ timeout: 5000 });
      await germanyOption.click();
      const cityField = searchLocationForm.locator("#form-item-city");
      await cityField.click();
      await expect(modal.root.getByRole("option").first()).toBeHidden({
        timeout: 5000,
      });
      await cityField.fill("Berlin");
      await searchLocationForm
        .locator("#form-item-street")
        .fill("Unter den Linden 1");
      await searchLocationForm.locator("#search-location-submit").click();

      const locationOptions = modal.root.locator("#form-item-location");
      const firstOptionRow = locationOptions
        .locator("div.style-menu-option")
        .first();
      await firstOptionRow
        .waitFor({ state: "visible", timeout: 15000 })
        .catch(() => {});
      const hasLocationOptions = await firstOptionRow
        .isVisible()
        .catch(() => false);
      if (!hasLocationOptions) {
        test.skip(
          true,
          "No location options visible after search (Search may not have run or location API returned no results within 15s)"
        );
        return;
      }
      await firstOptionRow.click();
      await modal.root
        .locator("#event-location-submit")
        .scrollIntoViewIfNeeded();
      await modal.root.locator("#event-location-submit").click();

      await expect(modal.timeForm).toBeVisible();
      const dayButtons = modal.root.locator(
        ".vc-day.in-month .vc-day-content[role='button']"
      );
      await dayButtons.first().click();
      await dayButtons.nth(1).click();
      await setFirstDayEndTimeToFuture(modal, page);
      await modal.root.evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });
      const submitBtn = modal.getNextStepButton();
      await submitBtn.click();

      await expect(modal.root).not.toBeVisible({ timeout: 15000 });
      await expect(page).toHaveURL(/\/events\/[^/]+\/about/, {
        timeout: 10000,
      });
    });
  }
);
