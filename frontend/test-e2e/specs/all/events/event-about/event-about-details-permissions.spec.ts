// SPDX-License-Identifier: AGPL-3.0-or-later
import {
  navigateToFirstEvent,
  navigateToLastEventSubpage,
} from "~/test-e2e/actions/navigation";
import { MEMBER_AUTH_STATE_PATH } from "~/test-e2e/constants/authPaths";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";
import {
  markAllScheduleDaysAllDay,
  openOrgsDropdown,
  setScheduleTimesForAllDays,
  submitDetailsEditForm,
} from "~/test-e2e/utils/event-about-details-helpers";
import { logTestPath, withTestStep } from "~/test-e2e/utils/test-traceability";

test.beforeEach(async ({ page }) => {
  await navigateToFirstEvent(page);
  await page.waitForLoadState("domcontentloaded");
});

// MARK: Unauthenticated

test.describe(
  "Unauthenticated user cannot edit event details",
  { tag: ["@desktop"] },
  () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test("Details card edit icon is not visible", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const { aboutPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify details card edit icon is hidden",
        async () => {
          await expect(aboutPage.detailsCardEditIcon).not.toBeVisible();
        }
      );
    });
  }
);

// MARK: Admin

test.describe("Admin can edit event details", { tag: ["@desktop"] }, () => {
  test("Details card edit icon is visible", async ({ page }, testInfo) => {
    logTestPath(testInfo);
    const { aboutPage } = newEventPage(page);
    await withTestStep(
      testInfo,
      "Verify details card edit icon is visible",
      async () => {
        await expect(aboutPage.detailsCardHeading).toBeVisible();
        await expect(aboutPage.detailsCardEditIcon).toBeVisible();
      }
    );
  });
});

// MARK: Non-admin member

test.describe(
  "Non-admin member cannot edit another user's event details",
  { tag: ["@desktop", "@member"] },
  () => {
    test.use({ storageState: MEMBER_AUTH_STATE_PATH });

    test("Details card edit icon is not visible", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const { aboutPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify details card edit icon is hidden for non-admin member",
        async () => {
          await expect(aboutPage.detailsCardEditIcon).not.toBeVisible();
        }
      );
    });
  }
);

// MARK: Non-admin member can edit own event

test.describe(
  "Non-admin member can edit their own event details",
  { tag: ["@desktop", "@member"] },
  () => {
    test.use({ storageState: MEMBER_AUTH_STATE_PATH });
    test.setTimeout(60000);

    test.beforeEach(async ({ page }) => {
      await navigateToLastEventSubpage(page, "about");
      await page.waitForLoadState("domcontentloaded");
    });

    // MARK: Location

    test("Member can update the online location link", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { eventId } = await navigateToLastEventSubpage(page, "about");

      const eventPage = newEventPage(page);
      const { aboutPage, detailsEditModal } = eventPage;

      await expect(aboutPage.detailsCardEditIcon).toBeVisible({
        timeout: 15000,
      });

      const timestamp = Date.now();
      const updatedLink = `https://example.com/event-details/${timestamp}`;

      await withTestStep(
        testInfo,
        "Open details edit modal and save updated online link",
        async () => {
          await aboutPage.detailsCardEditIcon.click();
          await expect(detailsEditModal.root).toBeVisible();

          await detailsEditModal.locationTypeSection
            .getByRole("radio", { name: /online/i })
            .click();
          await detailsEditModal.onlineLinkField.fill(updatedLink);
          await markAllScheduleDaysAllDay(detailsEditModal);

          await submitDetailsEditForm(page, detailsEditModal, eventId);
        }
      );

      await expect(
        page.getByRole("link", { name: updatedLink }).first()
      ).toBeVisible({
        timeout: 15000,
      });
    });

    // MARK: Organizations

    test("Member sees the event organization pre-selected when opening the modal", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const eventPage = newEventPage(page);
      const { aboutPage, detailsEditModal } = eventPage;

      await expect(aboutPage.detailsCardOrganizationLink).toBeVisible({
        timeout: 15000,
      });
      const orgNameOnCard =
        (await aboutPage.detailsCardOrganizationLink.textContent())?.trim() ??
        "";

      await withTestStep(
        testInfo,
        "Open modal and verify organization chip matches details card",
        async () => {
          await aboutPage.detailsCardEditIcon.click();
          await expect(detailsEditModal.root).toBeVisible();
          await expect(detailsEditModal.selectedOrgChips).toContainText(
            orgNameOnCard
          );

          await detailsEditModal.closeButton.click({ force: true });
          await expect(detailsEditModal.root).not.toBeVisible();
        }
      );
    });

    test("Member can change the organization and see it on the details card", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { eventId } = await navigateToLastEventSubpage(page, "about");

      const eventPage = newEventPage(page);
      const { aboutPage, detailsEditModal } = eventPage;

      await expect(aboutPage.detailsCardOrganizationLink).toBeVisible({
        timeout: 15000,
      });
      const currentOrgName =
        (await aboutPage.detailsCardOrganizationLink.textContent())?.trim() ??
        "";

      await aboutPage.detailsCardEditIcon.click();
      await expect(detailsEditModal.root).toBeVisible();

      await openOrgsDropdown(detailsEditModal);
      const options = detailsEditModal.orgDropdownOptions;
      const optionCount = await options.count();
      if (optionCount < 2) {
        test.skip(
          optionCount >= 2,
          "Member needs at least two organizations to test organization change"
        );
        return;
      }

      let newOrgName = "";
      for (let index = 0; index < optionCount; index += 1) {
        const optionText = (await options.nth(index).textContent())?.trim() ?? "";
        if (optionText && optionText !== currentOrgName) {
          newOrgName = optionText;
          await options.nth(index).click();
          break;
        }
      }

      if (!newOrgName) {
        test.skip(!!newOrgName, "No alternate organization available in dropdown");
        return;
      }

      await withTestStep(
        testInfo,
        "Save updated organization",
        async () => {
          await markAllScheduleDaysAllDay(detailsEditModal);
          await submitDetailsEditForm(page, detailsEditModal, eventId);
        }
      );

      await expect(aboutPage.detailsCardOrganizationLink).toContainText(
        newOrgName,
        { timeout: 15000 }
      );

      await withTestStep(
        testInfo,
        "Reopen modal and verify new organization remains selected",
        async () => {
          await aboutPage.detailsCardEditIcon.click();
          await expect(detailsEditModal.root).toBeVisible();
          await expect(detailsEditModal.selectedOrgChips).toContainText(
            newOrgName
          );
          await detailsEditModal.closeButton.click({ force: true });
        }
      );
    });

    // MARK: Schedule

    test("Member can save a single-day all-day schedule and reopen with same values", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { eventId } = await navigateToLastEventSubpage(page, "about");

      const eventPage = newEventPage(page);
      const { aboutPage, detailsEditModal } = eventPage;

      await expect(aboutPage.detailsCardEditIcon).toBeVisible({
        timeout: 15000,
      });

      await withTestStep(
        testInfo,
        "Save single-day all-day schedule",
        async () => {
          await aboutPage.detailsCardEditIcon.click();
          await expect(detailsEditModal.root).toBeVisible();

          const dayButtons = detailsEditModal.calendarDayButtons();
          const dayIndex = 12;
          await dayButtons.nth(dayIndex).click();
          await dayButtons.nth(dayIndex).click();

          await expect(
            detailsEditModal.root.locator(
              "input[data-testid^='all-day-long-event-']"
            )
          ).toHaveCount(1);

          const allDayCheckbox = detailsEditModal.allDayCheckbox(0);
          await allDayCheckbox.scrollIntoViewIfNeeded();
          await allDayCheckbox.check();

          await submitDetailsEditForm(page, detailsEditModal, eventId);
        }
      );

      await expect(page.getByText(/all day/i).first()).toBeVisible({
        timeout: 15000,
      });

      await withTestStep(
        testInfo,
        "Reopen modal and verify single-day all-day state persists",
        async () => {
          await aboutPage.detailsCardEditIcon.click();
          await expect(detailsEditModal.root).toBeVisible();

          await expect(detailsEditModal.allDayCheckbox(0)).toBeChecked();
          await expect(
            detailsEditModal.root.locator(
              "input[data-testid^='all-day-long-event-']"
            )
          ).toHaveCount(1);

          await detailsEditModal.closeButton.click({ force: true });
          await expect(detailsEditModal.root).not.toBeVisible();
        }
      );
    });

    test("Member can save a single-day timed schedule and reopen with same values", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { eventId } = await navigateToLastEventSubpage(page, "about");

      const eventPage = newEventPage(page);
      const { aboutPage, detailsEditModal } = eventPage;

      await expect(aboutPage.detailsCardEditIcon).toBeVisible({
        timeout: 15000,
      });

      await withTestStep(
        testInfo,
        "Save single-day timed schedule",
        async () => {
          await aboutPage.detailsCardEditIcon.click();
          await expect(detailsEditModal.root).toBeVisible();

          const dayButtons = detailsEditModal.calendarDayButtons();
          const dayIndex = 14;
          await dayButtons.nth(dayIndex).click();
          await dayButtons.nth(dayIndex).click();

          await expect(
            detailsEditModal.root.locator(
              "input[data-testid^='all-day-long-event-']"
            )
          ).toHaveCount(1);

          await setScheduleTimesForAllDays(detailsEditModal, page, "10:00", "11:00");

          await expect(detailsEditModal.allDayCheckbox(0)).not.toBeChecked();

          await submitDetailsEditForm(page, detailsEditModal, eventId);
        }
      );

      await expect(
        aboutPage.detailsCard.locator("p").filter({ hasText: /from/i })
      ).toHaveCount(1, { timeout: 15000 });

      await withTestStep(
        testInfo,
        "Reopen modal and verify single-day timed schedule persists",
        async () => {
          await aboutPage.detailsCardEditIcon.click();
          await expect(detailsEditModal.root).toBeVisible();

          await expect(
            detailsEditModal.root.locator(
              "input[data-testid^='all-day-long-event-']"
            )
          ).toHaveCount(1);
          await expect(detailsEditModal.allDayCheckbox(0)).not.toBeChecked();

          await detailsEditModal.closeButton.click({ force: true });
          await expect(detailsEditModal.root).not.toBeVisible();
        }
      );
    });
  }
);
