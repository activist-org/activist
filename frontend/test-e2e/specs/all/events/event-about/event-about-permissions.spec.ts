// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToFirstEvent } from "~/test-e2e/actions/navigation";
import { MEMBER_AUTH_STATE_PATH } from "~/test-e2e/constants/authPaths";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

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
  { tag: ["@desktop"] },
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
