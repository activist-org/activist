// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToEventSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

const errorToast = (page: Parameters<typeof newEventPage>[0]) =>
  page.locator(
    '[data-sonner-toast][data-type="error"][data-rich-colors="true"]'
  );

const resourceDeleteModal = (page: Parameters<typeof newEventPage>[0]) =>
  page.locator("#modal").first();

test.describe(
  "Event resource server error handling",
  { tag: ["@desktop"] },
  () => {
    test.beforeEach(async ({ page }) => {
      await navigateToEventSubpage(page, "resources");
    });

    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    // MARK: Create — 500

    test("Shows error toast and keeps modal open when create resource returns 500", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newEventPage(page);

      await withTestStep(testInfo, "Mock POST event_resources → 500", async () => {
        await page.route("**/api/auth/events/event_resources", async (route) => {
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

      await withTestStep(testInfo, "Submit new resource form", async () => {
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
      });

      await withTestStep(testInfo, "Assert error toast; modal stays open", async () => {
        await expect(errorToast(page)).toBeVisible();
        await expect(resourcesPage.resourceModal).toBeVisible();
      });
    });

    // MARK: Delete — 403

    test("Shows error toast and preserves list when delete resource returns 403", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newEventPage(page);

      // networkidle ensures all resource cards and their embedded ModalAlert
      // components are fully mounted before we interact with the delete flow.
      await page.waitForLoadState("networkidle");

      const initialCount = await resourcesPage.getResourceCount();
      if (initialCount === 0) test.skip();

      await withTestStep(testInfo, "Mock DELETE event_resources → 403", async () => {
        await page.route(
          "**/api/auth/events/event_resources/**",
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
      });

      await withTestStep(testInfo, "Confirm delete on first resource", async () => {
        await resourcesPage
          .getResourceDeleteButton(0)
          .evaluate((el: HTMLElement) => el.click());

        await expect(resourceDeleteModal(page)).toBeVisible();
        await resourceDeleteModal(page)
          .getByRole("button", { name: "Confirm" })
          .click();
      });

      await withTestStep(testInfo, "Assert error toast; list unchanged", async () => {
        await expect(errorToast(page)).toBeVisible();
        await expect(resourcesPage.resourceCards).toHaveCount(initialCount);
      });
    });

    // MARK: Create — 429

    test("Shows error toast and keeps modal open when create resource is rate-limited", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newEventPage(page);

      await withTestStep(testInfo, "Mock POST event_resources → 429", async () => {
        await page.route("**/api/auth/events/event_resources", async (route) => {
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

      await withTestStep(testInfo, "Submit new resource form", async () => {
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
      });

      await withTestStep(testInfo, "Assert error toast; modal stays open", async () => {
        await expect(errorToast(page)).toBeVisible();
        await expect(resourcesPage.resourceModal).toBeVisible();
      });
    });

    // MARK: Create — network abort

    test("Shows error toast when create resource network request is aborted", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { resourcesPage } = newEventPage(page);

      await withTestStep(testInfo, "Mock POST event_resources → abort", async () => {
        await page.route("**/api/auth/events/event_resources", async (route) => {
          if (route.request().method() !== "POST") {
            await route.continue();
            return;
          }
          await route.abort("failed");
        });
      });

      await withTestStep(testInfo, "Submit new resource form", async () => {
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
      });

      await withTestStep(testInfo, "Assert error toast", async () => {
        await expect(errorToast(page)).toBeVisible();
      });
    });
  }
);
