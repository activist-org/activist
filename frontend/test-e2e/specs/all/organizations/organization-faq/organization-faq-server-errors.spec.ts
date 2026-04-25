// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

const errorToast = (page: Parameters<typeof newOrganizationPage>[0]) =>
  page.locator(
    '[data-sonner-toast][data-type="error"][data-rich-colors="true"]'
  );

const faqDeleteModal = (page: Parameters<typeof newOrganizationPage>[0]) =>
  page.locator("#modal").first();

test.describe(
  "Organization FAQ server error handling",
  { tag: ["@desktop"] },
  () => {
    test.beforeEach(async ({ page }) => {
      await navigateToOrganizationSubpage(page, "faq");
    });

    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    // MARK: Create — 500

    test("Shows error toast and keeps modal open when create FAQ returns 500", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { faqPage } = newOrganizationPage(page);

      await page.route(
        "**/api/auth/communities/organization_faqs",
        async (route) => {
          if (route.request().method() !== "POST") {
            await route.continue();
            return;
          }
          await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({ detail: "Internal server error." }),
          });
        }
      );

      await faqPage.newFAQButton.click();
      await expect(faqPage.faqModal).toBeVisible();

      await faqPage
        .faqQuestionInput(faqPage.faqModal)
        .fill("Test question for error");
      await faqPage
        .faqAnswerInput(faqPage.faqModal)
        .fill("Test answer for error");
      await faqPage.faqSubmitButton(faqPage.faqModal).click();

      await expect(errorToast(page)).toBeVisible();
      await expect(faqPage.faqModal).toBeVisible();
    });

    // MARK: Delete — 403

    test("Shows error toast and preserves list when delete FAQ returns 403", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { faqPage } = newOrganizationPage(page);

      // networkidle ensures all FAQ cards and their embedded ModalAlert components
      // are fully mounted before we interact with the delete flow.
      await page.waitForLoadState("networkidle");

      const initialCount = await faqPage.getFAQCount();
      if (initialCount === 0) test.skip();

      await page.route(
        "**/api/auth/communities/organization_faqs/**",
        async (route) => {
          if (route.request().method() !== "DELETE") {
            await route.continue();
            return;
          }
          await route.fulfill({
            status: 403,
            contentType: "application/json",
            body: JSON.stringify({ detail: "You do not have permission." }),
          });
        }
      );

      await faqPage
        .getFAQDeleteButton(0)
        .evaluate((el: HTMLElement) => el.click());

      await expect(faqDeleteModal(page)).toBeVisible();
      await faqDeleteModal(page)
        .getByRole("button", { name: "Confirm" })
        .click();

      await expect(errorToast(page)).toBeVisible();
      await expect(faqPage.faqCards).toHaveCount(initialCount);
    });

    // MARK: Create — 429

    test("Shows error toast and keeps modal open when create FAQ is rate-limited", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { faqPage } = newOrganizationPage(page);

      await page.route(
        "**/api/auth/communities/organization_faqs",
        async (route) => {
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
        }
      );

      await faqPage.newFAQButton.click();
      await expect(faqPage.faqModal).toBeVisible();

      await faqPage
        .faqQuestionInput(faqPage.faqModal)
        .fill("Test question for rate limit");
      await faqPage
        .faqAnswerInput(faqPage.faqModal)
        .fill("Test answer for rate limit");
      await faqPage.faqSubmitButton(faqPage.faqModal).click();

      await expect(errorToast(page)).toBeVisible();
      await expect(faqPage.faqModal).toBeVisible();
    });

    // MARK: Create — network abort

    test("Shows error toast when create FAQ network request is aborted", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { faqPage } = newOrganizationPage(page);

      await page.route(
        "**/api/auth/communities/organization_faqs",
        async (route) => {
          if (route.request().method() !== "POST") {
            await route.continue();
            return;
          }
          await route.abort("failed");
        }
      );

      await faqPage.newFAQButton.click();
      await expect(faqPage.faqModal).toBeVisible();

      await faqPage
        .faqQuestionInput(faqPage.faqModal)
        .fill("Test question for abort");
      await faqPage
        .faqAnswerInput(faqPage.faqModal)
        .fill("Test answer for abort");
      await faqPage.faqSubmitButton(faqPage.faqModal).click();

      await expect(errorToast(page)).toBeVisible();
    });
  }
);
