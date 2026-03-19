// SPDX-License-Identifier: AGPL-3.0-or-later
import {
  navigateToEventSubpage,
  navigateToLastEventSubpage,
} from "~/test-e2e/actions/navigation";
import { MEMBER_AUTH_STATE_PATH } from "~/test-e2e/constants/authPaths";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  await navigateToEventSubpage(page, "resources");
  await page.waitForLoadState("domcontentloaded");
});

// MARK: Unauthenticated

test.describe(
  "Unauthenticated user cannot manage event resources",
  { tag: ["@desktop"] },
  () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test("New resource button is not visible", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify new resource button is hidden",
        async () => {
          await expect(resourcesPage.newResourceButton).not.toBeVisible();
        }
      );
    });

    test("Resource edit button is not visible on any card", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify resource edit button is hidden on first card",
        async () => {
          const cardCount = await resourcesPage.resourceCards.count();
          if (cardCount > 0) {
            await expect(
              resourcesPage.getResourceEditButton(0)
            ).not.toBeVisible();
          } else {
            await expect(resourcesPage.newResourceButton).not.toBeVisible();
          }
        }
      );
    });

    test("Resource delete button is not visible on any card", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify resource delete button is hidden on first card",
        async () => {
          const cardCount = await resourcesPage.resourceCards.count();
          if (cardCount > 0) {
            await expect(
              resourcesPage.getResourceDeleteButton(0)
            ).not.toBeVisible();
          } else {
            await expect(resourcesPage.newResourceButton).not.toBeVisible();
          }
        }
      );
    });
  }
);

// MARK: Admin

test.describe("Admin can manage event resources", { tag: ["@desktop"] }, () => {
  test("New resource button is visible", async ({ page }, testInfo) => {
    logTestPath(testInfo);
    const { resourcesPage } = newEventPage(page);
    await withTestStep(
      testInfo,
      "Verify new resource button is visible for admin",
      async () => {
        await expect(resourcesPage.newResourceButton).toBeVisible();
      }
    );
  });

  test("Resource edit button is visible on first resource card", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);
    const { resourcesPage } = newEventPage(page);
    await withTestStep(
      testInfo,
      "Wait for resource cards and verify edit button is visible",
      async () => {
        await expect(resourcesPage.resourceCards.first()).toBeVisible({
          timeout: 5000,
        });
        await expect(resourcesPage.getResourceEditButton(0)).toBeVisible();
      }
    );
  });

  test("Resource delete button is visible on first resource card", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);
    const { resourcesPage } = newEventPage(page);
    await withTestStep(
      testInfo,
      "Wait for resource cards and verify delete button is visible",
      async () => {
        await expect(resourcesPage.resourceCards.first()).toBeVisible({
          timeout: 5000,
        });
        await expect(resourcesPage.getResourceDeleteButton(0)).toBeVisible();
      }
    );
  });
});

// MARK: Non-admin member

test.describe(
  "Non-admin member cannot manage event resources",
  { tag: ["@desktop", "@member"] },
  () => {
    test.use({ storageState: MEMBER_AUTH_STATE_PATH });

    test("New resource button is not visible", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify new resource button is hidden for non-admin member",
        async () => {
          await expect(resourcesPage.newResourceButton).not.toBeVisible();
        }
      );
    });

    test("Resource edit button is not visible on any card", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify resource edit button is hidden for non-admin member",
        async () => {
          const cardCount = await resourcesPage.resourceCards.count();
          if (cardCount > 0) {
            await expect(
              resourcesPage.getResourceEditButton(0)
            ).not.toBeVisible();
          } else {
            await expect(resourcesPage.newResourceButton).not.toBeVisible();
          }
        }
      );
    });

    test("Resource delete button is not visible on any card", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify resource delete button is hidden for non-admin member",
        async () => {
          const cardCount = await resourcesPage.resourceCards.count();
          if (cardCount > 0) {
            await expect(
              resourcesPage.getResourceDeleteButton(0)
            ).not.toBeVisible();
          } else {
            await expect(resourcesPage.newResourceButton).not.toBeVisible();
          }
        }
      );
    });
  }
);

// MARK: Non-admin member can edit own event resources

test.describe(
  "Non-admin member can edit their own event resources",
  { tag: ["@desktop", "@member"] },
  () => {
    test.use({ storageState: MEMBER_AUTH_STATE_PATH });

    test("New resource button is visible on own event", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      await navigateToLastEventSubpage(page, "resources");
      await page.waitForLoadState("domcontentloaded");

      const { resourcesPage } = newEventPage(page);
      await expect(resourcesPage.newResourceButton).toBeVisible({
        timeout: 15000,
      });
    });

    test("Resource edit button is visible on first resource card when present", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      await navigateToLastEventSubpage(page, "resources");
      await page.waitForLoadState("domcontentloaded");

      const { resourcesPage } = newEventPage(page);
      await expect(resourcesPage.resourcesList).toBeVisible({
        timeout: 15000,
      });
      // Wait for new resource button so event is loaded and canEdit has resolved for card icons.
      await expect(resourcesPage.newResourceButton).toBeVisible({
        timeout: 15000,
      });

      const cardCount = await resourcesPage.resourceCards.count();
      if (cardCount > 0) {
        await withTestStep(
          testInfo,
          "Verify resource edit button is visible for member on own event",
          async () => {
            await expect(resourcesPage.getResourceEditButton(0)).toBeVisible({
              timeout: 10000,
            });
          }
        );
      }
      // If no resources, seed data has none for this event; new resource button visibility is covered above.
    });
  }
);
