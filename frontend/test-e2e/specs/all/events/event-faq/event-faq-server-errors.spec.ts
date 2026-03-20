// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToEventSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

const errorToast = (page: Parameters<typeof newEventPage>[0]) =>
  page.locator(
    '[data-sonner-toast][data-type="error"][data-rich-colors="true"]'
  );

const faqDeleteModal = (page: Parameters<typeof newEventPage>[0]) =>
  page.locator("#modal").first();

test.describe("Event FAQ server error handling", { tag: ["@desktop"] }, () => {
  test.beforeEach(async ({ page }) => {
    await navigateToEventSubpage(page, "faq");
  });

  test.afterEach(async ({ page }) => {
    await page.unrouteAll();
  });

  // MARK: Create — 500

  test("Shows error toast and keeps modal open when create FAQ returns 500", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);
    const { faqPage } = newEventPage(page);

    await withTestStep(testInfo, "Mock POST event_faqs → 500", async () => {
      await page.route("**/api/auth/events/event_faqs", async (route) => {
        if (route.request().method() !== "POST") {
          await route.continue();
          return;
        }
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ detail: "Internal server error." }),
        });
      });
    });

    await withTestStep(testInfo, "Submit new FAQ form", async () => {
      await faqPage.newFAQButton.click();
      await expect(faqPage.faqModal).toBeVisible();

      await faqPage
        .faqQuestionInput(faqPage.faqModal)
        .fill("Test question for error");
      await faqPage
        .faqAnswerInput(faqPage.faqModal)
        .fill("Test answer for error");
      await faqPage.faqSubmitButton(faqPage.faqModal).click();
    });

    await withTestStep(testInfo, "Assert error toast; modal stays open", async () => {
      await expect(errorToast(page)).toBeVisible();
      await expect(faqPage.faqModal).toBeVisible();
    });
  });

  // MARK: Delete — 403

  test("Shows error toast and preserves list when delete FAQ returns 403", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);
    const { faqPage } = newEventPage(page);

    // networkidle ensures all FAQ cards and their embedded ModalAlert components
    // are fully mounted before we interact with the delete flow.
    await page.waitForLoadState("networkidle");

    const initialCount = await faqPage.getFAQCount();
    if (initialCount === 0) test.skip();

    await withTestStep(testInfo, "Mock DELETE event_faqs → 403", async () => {
      await page.route("**/api/auth/events/event_faqs/**", async (route) => {
        if (route.request().method() !== "DELETE") {
          await route.continue();
          return;
        }
        await route.fulfill({
          status: 403,
          contentType: "application/json",
          body: JSON.stringify({ detail: "You do not have permission." }),
        });
      });
    });

    await withTestStep(testInfo, "Confirm delete on first FAQ", async () => {
      await faqPage
        .getFAQDeleteButton(0)
        .evaluate((el: HTMLElement) => el.click());

      await expect(faqDeleteModal(page)).toBeVisible();
      await faqDeleteModal(page).getByRole("button", { name: "Confirm" }).click();
    });

    await withTestStep(testInfo, "Assert error toast; list unchanged", async () => {
      await expect(errorToast(page)).toBeVisible();
      await expect(faqPage.faqCards).toHaveCount(initialCount);
    });
  });

  // MARK: Create — 429

  test("Shows error toast and keeps modal open when create FAQ is rate-limited", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);
    const { faqPage } = newEventPage(page);

    await withTestStep(testInfo, "Mock POST event_faqs → 429", async () => {
      await page.route("**/api/auth/events/event_faqs", async (route) => {
        if (route.request().method() !== "POST") {
          await route.continue();
          return;
        }
        await route.fulfill({
          status: 429,
          headers: { "Retry-After": "60" },
          contentType: "application/json",
          body: JSON.stringify({ detail: "Too many requests." }),
        });
      });
    });

    await withTestStep(testInfo, "Submit new FAQ form", async () => {
      await faqPage.newFAQButton.click();
      await expect(faqPage.faqModal).toBeVisible();

      await faqPage
        .faqQuestionInput(faqPage.faqModal)
        .fill("Test question for rate limit");
      await faqPage
        .faqAnswerInput(faqPage.faqModal)
        .fill("Test answer for rate limit");
      await faqPage.faqSubmitButton(faqPage.faqModal).click();
    });

    await withTestStep(testInfo, "Assert error toast; modal stays open", async () => {
      await expect(errorToast(page)).toBeVisible();
      await expect(faqPage.faqModal).toBeVisible();
    });
  });

  // MARK: Create — network abort

  test("Shows error toast when create FAQ network request is aborted", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);
    const { faqPage } = newEventPage(page);

    await withTestStep(testInfo, "Mock POST event_faqs → abort", async () => {
      await page.route("**/api/auth/events/event_faqs", async (route) => {
        if (route.request().method() !== "POST") {
          await route.continue();
          return;
        }
        await route.abort("failed");
      });
    });

    await withTestStep(testInfo, "Submit new FAQ form", async () => {
      await faqPage.newFAQButton.click();
      await expect(faqPage.faqModal).toBeVisible();

      await faqPage
        .faqQuestionInput(faqPage.faqModal)
        .fill("Test question for abort");
      await faqPage
        .faqAnswerInput(faqPage.faqModal)
        .fill("Test answer for abort");
      await faqPage.faqSubmitButton(faqPage.faqModal).click();
    });

    await withTestStep(testInfo, "Assert error toast", async () => {
      await expect(errorToast(page)).toBeVisible();
    });
  });
});
