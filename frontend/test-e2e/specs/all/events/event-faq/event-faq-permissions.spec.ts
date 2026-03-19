// SPDX-License-Identifier: AGPL-3.0-or-later
import {
  navigateToEventSubpage,
  navigateToLastEventSubpage,
} from "~/test-e2e/actions/navigation";
import { MEMBER_AUTH_STATE_PATH } from "~/test-e2e/constants/authPaths";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";
import { ensureMinimumFAQs } from "~/test-e2e/utils/faqHelpers";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  await navigateToEventSubpage(page, "faq");
  await page.waitForLoadState("domcontentloaded");
});

// MARK: Unauthenticated

test.describe(
  "Unauthenticated user cannot manage event FAQs",
  { tag: ["@desktop"] },
  () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test("New FAQ button is not visible", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const { faqPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify new FAQ button is hidden",
        async () => {
          await expect(faqPage.newFAQButton).not.toBeVisible();
        }
      );
    });

    test("FAQ edit button is not visible on any card", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { faqPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify FAQ edit button is hidden on first card",
        async () => {
          const cardCount = await faqPage.faqCards.count();
          if (cardCount > 0) {
            await expect(faqPage.getFAQEditButton(0)).not.toBeVisible();
          } else {
            // No FAQ cards present; new FAQ button absence is sufficient signal.
            await expect(faqPage.newFAQButton).not.toBeVisible();
          }
        }
      );
    });

    test("FAQ delete button is not visible on any card", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { faqPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify FAQ delete button is hidden on first card",
        async () => {
          const cardCount = await faqPage.faqCards.count();
          if (cardCount > 0) {
            await expect(faqPage.getFAQDeleteButton(0)).not.toBeVisible();
          } else {
            await expect(faqPage.newFAQButton).not.toBeVisible();
          }
        }
      );
    });
  }
);

// MARK: Admin

test.describe("Admin can manage event FAQs", { tag: ["@desktop"] }, () => {
  test("New FAQ button is visible", async ({ page }, testInfo) => {
    logTestPath(testInfo);
    const { faqPage } = newEventPage(page);
    await withTestStep(
      testInfo,
      "Verify new FAQ button is visible for admin",
      async () => {
        await expect(faqPage.newFAQButton).toBeVisible();
      }
    );
  });

  test("FAQ edit button is visible on first FAQ card", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);
    const { faqPage } = newEventPage(page);
    await withTestStep(
      testInfo,
      "Wait for FAQ cards and verify edit button is visible",
      async () => {
        await expect(faqPage.faqCards.first()).toBeVisible({ timeout: 5000 });
        await expect(faqPage.getFAQEditButton(0)).toBeVisible();
      }
    );
  });

  test("FAQ delete button is visible on first FAQ card", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);
    const { faqPage } = newEventPage(page);
    await withTestStep(
      testInfo,
      "Wait for FAQ cards and verify delete button is visible",
      async () => {
        await expect(faqPage.faqCards.first()).toBeVisible({ timeout: 5000 });
        await expect(faqPage.getFAQDeleteButton(0)).toBeVisible();
      }
    );
  });
});

// MARK: Non-admin member

test.describe(
  "Non-admin member cannot manage event FAQs",
  { tag: ["@desktop", "@member"] },
  () => {
    test.use({ storageState: MEMBER_AUTH_STATE_PATH });

    test("New FAQ button is not visible", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const { faqPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify new FAQ button is hidden for non-admin member",
        async () => {
          await expect(faqPage.newFAQButton).not.toBeVisible();
        }
      );
    });

    test("FAQ edit button is not visible on any card", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { faqPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify FAQ edit button is hidden for non-admin member",
        async () => {
          const cardCount = await faqPage.faqCards.count();
          if (cardCount > 0) {
            await expect(faqPage.getFAQEditButton(0)).not.toBeVisible();
          } else {
            await expect(faqPage.newFAQButton).not.toBeVisible();
          }
        }
      );
    });

    test("FAQ delete button is not visible on any card", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { faqPage } = newEventPage(page);
      await withTestStep(
        testInfo,
        "Verify FAQ delete button is hidden for non-admin member",
        async () => {
          const cardCount = await faqPage.faqCards.count();
          if (cardCount > 0) {
            await expect(faqPage.getFAQDeleteButton(0)).not.toBeVisible();
          } else {
            await expect(faqPage.newFAQButton).not.toBeVisible();
          }
        }
      );
    });
  }
);

// MARK: Non-admin member can edit own event FAQs

test.describe(
  "Non-admin member can edit their own event FAQs",
  { tag: ["@desktop", "@member"] },
  () => {
    test.use({ storageState: MEMBER_AUTH_STATE_PATH });

    test("New FAQ button is visible on own event", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      await navigateToLastEventSubpage(page, "faq");
      await page.waitForLoadState("domcontentloaded");

      const { faqPage } = newEventPage(page);
      // Wait for FAQ content (list or empty state) so event is loaded and BtnActionAdd's v-if="canAdd" has resolved.
      await expect(
        faqPage.faqCards.first().or(faqPage.emptyState)
      ).toBeVisible({ timeout: 15000 });
      await expect(faqPage.newFAQButton).toBeVisible({ timeout: 15000 });
    });

    test("FAQ edit button is visible on first FAQ card when present", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      await navigateToLastEventSubpage(page, "faq");
      await page.waitForLoadState("domcontentloaded");

      const eventPage = newEventPage(page);
      const { faqPage } = eventPage;
      await expect(faqPage.faqCards.first().or(faqPage.emptyState)).toBeVisible(
        { timeout: 15000 }
      );
      await expect(faqPage.newFAQButton).toBeVisible({ timeout: 15000 });

      await ensureMinimumFAQs(page, faqPage, 1);

      await withTestStep(
        testInfo,
        "Verify FAQ edit button is visible for member on own event",
        async () => {
          await expect(faqPage.getFAQEditButton(0)).toBeVisible({
            timeout: 10000,
          });
        }
      );
    });
  }
);
