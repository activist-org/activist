// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

const errorToast = (page: Parameters<typeof newOrganizationPage>[0]) =>
  page.locator(
    '[data-sonner-toast][data-type="error"][data-rich-colors="true"]'
  );

const resourceDeleteModal = (page: Parameters<typeof newOrganizationPage>[0]) =>
  page.locator("#modal").first();

test.describe(
  "Organization resource server error handling",
  { tag: ["@desktop"] },
  () => {
    test.beforeEach(async ({ page }) => {
      await navigateToOrganizationSubpage(page, "resources");
    });

    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    // MARK: Create — 500

    test("Shows error toast and keeps modal open when create resource returns 500", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newOrganizationPage(page);

      await page.route(
        "**/api/auth/communities/organization_resources",
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

      await resourcesPage.newResourceButton.click();
      await expect(resourcesPage.resourceModal).toBeVisible();

      await resourcesPage
        .resourceNameInput(resourcesPage.resourceModal)
        .fill("Test resource name");
      await resourcesPage
        .resourceDescriptionInput(resourcesPage.resourceModal)
        .fill("Test resource description");
      await resourcesPage
        .resourceUrlInput(resourcesPage.resourceModal)
        .fill("https://example.com");
      await resourcesPage
        .resourceSubmitButton(resourcesPage.resourceModal)
        .click();

      await expect(errorToast(page)).toBeVisible();
      await expect(resourcesPage.resourceModal).toBeVisible();
    });

    // MARK: Delete — 403

    test("Shows error toast and preserves list when delete resource returns 403", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newOrganizationPage(page);

      // networkidle ensures all resource cards and their embedded ModalAlert
      // components are fully mounted before we interact with the delete flow.
      await page.waitForLoadState("networkidle");

      const initialCount = await resourcesPage.getResourceCount();
      if (initialCount === 0) test.skip();

      await page.route(
        "**/api/auth/communities/organization_resources/**",
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

      await resourcesPage
        .getResourceDeleteButton(0)
        .evaluate((el: HTMLElement) => el.click());

      await expect(resourceDeleteModal(page)).toBeVisible();
      await resourceDeleteModal(page)
        .getByRole("button", { name: "Confirm" })
        .click();

      await expect(errorToast(page)).toBeVisible();
      await expect(resourcesPage.resourceCards).toHaveCount(initialCount);
    });

    // MARK: Create — 429

    test("Shows error toast and keeps modal open when create resource is rate-limited", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newOrganizationPage(page);

      await page.route(
        "**/api/auth/communities/organization_resources",
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

      await resourcesPage.newResourceButton.click();
      await expect(resourcesPage.resourceModal).toBeVisible();

      await resourcesPage
        .resourceNameInput(resourcesPage.resourceModal)
        .fill("Test resource name");
      await resourcesPage
        .resourceDescriptionInput(resourcesPage.resourceModal)
        .fill("Test resource description");
      await resourcesPage
        .resourceUrlInput(resourcesPage.resourceModal)
        .fill("https://example.com");
      await resourcesPage
        .resourceSubmitButton(resourcesPage.resourceModal)
        .click();

      await expect(errorToast(page)).toBeVisible();
      await expect(resourcesPage.resourceModal).toBeVisible();
    });

    // MARK: Create — network abort

    test("Shows error toast when create resource network request is aborted", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newOrganizationPage(page);

      await page.route(
        "**/api/auth/communities/organization_resources",
        async (route) => {
          if (route.request().method() !== "POST") {
            await route.continue();
            return;
          }
          await route.abort("failed");
        }
      );

      await resourcesPage.newResourceButton.click();
      await expect(resourcesPage.resourceModal).toBeVisible();

      await resourcesPage
        .resourceNameInput(resourcesPage.resourceModal)
        .fill("Test resource name");
      await resourcesPage
        .resourceDescriptionInput(resourcesPage.resourceModal)
        .fill("Test resource description");
      await resourcesPage
        .resourceUrlInput(resourcesPage.resourceModal)
        .fill("https://example.com");
      await resourcesPage
        .resourceSubmitButton(resourcesPage.resourceModal)
        .click();

      await expect(errorToast(page)).toBeVisible();
    });
  }
);
