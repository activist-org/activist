// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToEventSubpage } from "~/test-e2e/actions/navigation";
import { expect, MEMBER_AUTH_STATE_PATH, test } from "~/test-e2e/global-fixtures";
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

    test(
      "New resource button is not visible",
      async ({ page }, testInfo) => {
        logTestPath(testInfo);
        const { resourcesPage } = newEventPage(page);
        await withTestStep(
          testInfo,
          "Verify new resource button is hidden",
          async () => {
            await expect(resourcesPage.newResourceButton).not.toBeVisible();
          }
        );
      }
    );

    test(
      "Resource edit button is not visible on any card",
      async ({ page }, testInfo) => {
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
      }
    );

    test(
      "Resource delete button is not visible on any card",
      async ({ page }, testInfo) => {
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
      }
    );
  }
);

// MARK: Admin

test.describe(
  "Admin can manage event resources",
  { tag: ["@desktop"] },
  () => {
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

    test(
      "Resource edit button is visible on first resource card",
      async ({ page }, testInfo) => {
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
      }
    );

    test(
      "Resource delete button is visible on first resource card",
      async ({ page }, testInfo) => {
        logTestPath(testInfo);
        const { resourcesPage } = newEventPage(page);
        await withTestStep(
          testInfo,
          "Wait for resource cards and verify delete button is visible",
          async () => {
            await expect(resourcesPage.resourceCards.first()).toBeVisible({
              timeout: 5000,
            });
            await expect(
              resourcesPage.getResourceDeleteButton(0)
            ).toBeVisible();
          }
        );
      }
    );
  }
);

// MARK: Non-admin member

test.describe(
  "Non-admin member cannot manage event resources",
  { tag: ["@desktop"] },
  () => {
    test.use({ storageState: MEMBER_AUTH_STATE_PATH });

    test(
      "New resource button is not visible",
      async ({ page }, testInfo) => {
        logTestPath(testInfo);
        const { resourcesPage } = newEventPage(page);
        await withTestStep(
          testInfo,
          "Verify new resource button is hidden for non-admin member",
          async () => {
            await expect(resourcesPage.newResourceButton).not.toBeVisible();
          }
        );
      }
    );

    test(
      "Resource edit button is not visible on any card",
      async ({ page }, testInfo) => {
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
      }
    );

    test(
      "Resource delete button is not visible on any card",
      async ({ page }, testInfo) => {
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
      }
    );
  }
);
