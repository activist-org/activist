// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
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
  "Organization group resource server error handling",
  { tag: ["@desktop"] },
  () => {
    test.beforeEach(async ({ page }) => {
      await navigateToOrganizationGroupSubpage(page, "resources");
    });

    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    // MARK: Create — 500

    test("Shows error toast and keeps modal open when create resource returns 500", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { groupResourcesPage } = newOrganizationPage(page);

      await page.route(
        "**/api/auth/communities/group_resources",
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

      await groupResourcesPage.newResourceButton.click();
      await expect(groupResourcesPage.resourceModal).toBeVisible();

      await groupResourcesPage
        .getResourceNameInput(groupResourcesPage.resourceModal)
        .fill("Test resource name");
      await groupResourcesPage
        .getResourceDescriptionInput(groupResourcesPage.resourceModal)
        .fill("Test resource description");
      await groupResourcesPage
        .getResourceUrlInput(groupResourcesPage.resourceModal)
        .fill("https://example.com");
      await groupResourcesPage
        .getResourceSubmitButton(groupResourcesPage.resourceModal)
        .click();

      await expect(errorToast(page)).toBeVisible();
      await expect(groupResourcesPage.resourceModal).toBeVisible();
    });

    // MARK: Delete — 403

    test("Shows error toast and preserves list when delete resource returns 403", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { groupResourcesPage } = newOrganizationPage(page);

      // networkidle ensures all resource cards and their embedded ModalAlert
      // components are fully mounted before we interact with the delete flow.
      await page.waitForLoadState("networkidle");

      const initialCount = await groupResourcesPage.getResourceCount();
      if (initialCount === 0) test.skip();

      await page.route(
        "**/api/auth/communities/group_resources/**",
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

      await groupResourcesPage
        .getResourceDeleteButton(0)
        .evaluate((el: HTMLElement) => el.click());

      await expect(resourceDeleteModal(page)).toBeVisible();
      await resourceDeleteModal(page)
        .getByRole("button", { name: "Confirm" })
        .click();

      await expect(errorToast(page)).toBeVisible();
      await expect(groupResourcesPage.resourceCards).toHaveCount(initialCount);
    });

    // MARK: Create — 429

    test("Shows error toast and keeps modal open when create resource is rate-limited", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { groupResourcesPage } = newOrganizationPage(page);

      await page.route(
        "**/api/auth/communities/group_resources",
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

      await groupResourcesPage.newResourceButton.click();
      await expect(groupResourcesPage.resourceModal).toBeVisible();

      await groupResourcesPage
        .getResourceNameInput(groupResourcesPage.resourceModal)
        .fill("Test resource name");
      await groupResourcesPage
        .getResourceDescriptionInput(groupResourcesPage.resourceModal)
        .fill("Test resource description");
      await groupResourcesPage
        .getResourceUrlInput(groupResourcesPage.resourceModal)
        .fill("https://example.com");
      await groupResourcesPage
        .getResourceSubmitButton(groupResourcesPage.resourceModal)
        .click();

      await expect(errorToast(page)).toBeVisible();
      await expect(groupResourcesPage.resourceModal).toBeVisible();
    });

    // MARK: Create — network abort

    test("Shows error toast when create resource network request is aborted", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { groupResourcesPage } = newOrganizationPage(page);

      await page.route(
        "**/api/auth/communities/group_resources",
        async (route) => {
          if (route.request().method() !== "POST") {
            await route.continue();
            return;
          }
          await route.abort("failed");
        }
      );

      await groupResourcesPage.newResourceButton.click();
      await expect(groupResourcesPage.resourceModal).toBeVisible();

      await groupResourcesPage
        .getResourceNameInput(groupResourcesPage.resourceModal)
        .fill("Test resource name");
      await groupResourcesPage
        .getResourceDescriptionInput(groupResourcesPage.resourceModal)
        .fill("Test resource description");
      await groupResourcesPage
        .getResourceUrlInput(groupResourcesPage.resourceModal)
        .fill("https://example.com");
      await groupResourcesPage
        .getResourceSubmitButton(groupResourcesPage.resourceModal)
        .click();

      await expect(errorToast(page)).toBeVisible();
    });
  }
);
