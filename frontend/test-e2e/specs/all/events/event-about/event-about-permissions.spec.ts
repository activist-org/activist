// SPDX-License-Identifier: AGPL-3.0-or-later
import {
  navigateToFirstEvent,
  navigateToLastEventSubpage,
} from "~/test-e2e/actions/navigation";
import { MEMBER_AUTH_STATE_PATH } from "~/test-e2e/constants/authPaths";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/test-traceability";

test.beforeEach(async ({ page }) => {
  await navigateToFirstEvent(page);
  await page.waitForLoadState("domcontentloaded");
});

// MARK: Unauthenticated

test.describe(
  "Unauthenticated user cannot edit event about content",
  { tag: ["@desktop"] },
  () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test("About card edit icon is not visible", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const { aboutPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify about card edit icon is hidden",
        async () => {
          await expect(aboutPage.aboutCardEditIcon).not.toBeVisible();
        }
      );
    });

    test("Get involved card edit icon is not visible", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { aboutPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify get involved card edit icon is hidden",
        async () => {
          await expect(aboutPage.getInvolvedCardEditIcon).not.toBeVisible();
        }
      );
    });

    test("Connect card edit icon is not visible", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { aboutPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify connect card edit icon is hidden",
        async () => {
          await expect(aboutPage.connectCardEditIcon).not.toBeVisible();
        }
      );
    });
  }
);

// MARK: Admin

test.describe(
  "Admin can edit event about content",
  { tag: ["@desktop"] },
  () => {
    test("About card edit icon is visible", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const { aboutPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify about card edit icon is visible",
        async () => {
          await expect(aboutPage.aboutCard).toBeVisible();
          await expect(aboutPage.aboutCardEditIcon).toBeVisible();
        }
      );
    });

    test("Get involved card edit icon is visible", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { aboutPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify get involved card edit icon is visible",
        async () => {
          await expect(aboutPage.getInvolvedCard).toBeVisible();
          await expect(aboutPage.getInvolvedCardEditIcon).toBeVisible();
        }
      );
    });

    test("Connect card edit icon is visible", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const { aboutPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify connect card edit icon is visible",
        async () => {
          await expect(aboutPage.connectCard).toBeVisible();
          await expect(aboutPage.connectCardEditIcon).toBeVisible();
        }
      );
    });
  }
);

// MARK: Non-admin member

test.describe(
  "Non-admin member cannot edit event about content",
  { tag: ["@desktop", "@member"] },
  () => {
    test.use({ storageState: MEMBER_AUTH_STATE_PATH });

    test("About card edit icon is not visible", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const { aboutPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify about card edit icon is hidden for non-admin member",
        async () => {
          await expect(aboutPage.aboutCardEditIcon).not.toBeVisible();
        }
      );
    });

    test("Get involved card edit icon is not visible", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { aboutPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify get involved card edit icon is hidden for non-admin member",
        async () => {
          await expect(aboutPage.getInvolvedCardEditIcon).not.toBeVisible();
        }
      );
    });

    test("Connect card edit icon is not visible", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { aboutPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify connect card edit icon is hidden for non-admin member",
        async () => {
          await expect(aboutPage.connectCardEditIcon).not.toBeVisible();
        }
      );
    });
  }
);

// MARK: Non-admin member can edit own event

test.describe(
  "Non-admin member can edit their own event about content",
  { tag: ["@desktop", "@member"] },
  () => {
    test.use({ storageState: MEMBER_AUTH_STATE_PATH });

    test("Member can edit the About card description", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      await navigateToLastEventSubpage(page, "about");

      const eventPage = newEventPage(page);
      const { aboutPage, editModal } = eventPage;

      await expect(aboutPage.aboutCard).toBeVisible({ timeout: 15000 });
      await expect(aboutPage.aboutCardEditIcon).toBeVisible({
        timeout: 15000,
      });

      const timestamp = Date.now();
      const updatedDescription = `Member-updated About ${timestamp}`;

      await withTestStep(
        testInfo,
        "Open about edit modal and save updated description",
        async () => {
          await aboutPage.aboutCardEditIcon.click();
          await expect(editModal.modal).toBeVisible();
          const descriptionField = editModal.descriptionField(editModal.modal);
          await descriptionField.fill(updatedDescription);
          await editModal.submitButton(editModal.modal).click();
          await expect(editModal.modal).not.toBeVisible();
        }
      );

      await expect(aboutPage.aboutCard).toContainText(updatedDescription);
    });

    test("Member can edit the Get Involved card text and join URL", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      await navigateToLastEventSubpage(page, "about");

      const eventPage = newEventPage(page);
      const { aboutPage, editModal } = eventPage;

      await expect(aboutPage.getInvolvedCard).toBeVisible({ timeout: 15000 });
      await expect(aboutPage.getInvolvedCardEditIcon).toBeVisible({
        timeout: 15000,
      });

      const timestamp = Date.now();
      const updatedGetInvolved = `Member-updated Get Involved ${timestamp}`;
      const updatedJoinUrl = `https://example.com/join/${timestamp}`;

      await withTestStep(
        testInfo,
        "Open get involved edit modal and save changes",
        async () => {
          await aboutPage.getInvolvedCardEditIcon.click();
          await expect(editModal.modal).toBeVisible();
          await editModal
            .getInvolvedField(editModal.modal)
            .fill(updatedGetInvolved);
          await editModal.joinUrlField(editModal.modal).fill(updatedJoinUrl);
          await editModal.submitButton(editModal.modal).click();
          await expect(editModal.modal).not.toBeVisible();
        }
      );

      await expect(aboutPage.getInvolvedCardText).toContainText(
        updatedGetInvolved
      );
      // Join URL is rendered in the page header (BtnRouteExternal). Wait for
      // event refetch and re-render so the header link appears with the new URL.
      const joinLink = page.locator(`a[href*="${updatedJoinUrl}"]`);
      await expect(joinLink).toBeVisible({ timeout: 15000 });
    });
  }
);
