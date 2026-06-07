// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Canonical E2E for the shared "list composable" failure pattern: GET list fails →
 * toast + EmptyState (same UX as a true empty catalog). Mirrors events-list-api-errors.spec.ts.
 */
import type { Page } from "@playwright/test";

import { getEnglishText } from "#shared/utils/i18n";

import { expect, test } from "~/test-e2e/global-fixtures";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

/** Public list endpoint used by `listOrganizations` (`withoutAuth: true` → /api/public). */
const ORGANIZATIONS_LIST_ROUTE = "**/api/public/communities/organizations**";

const errorToasts = (page: Page) =>
  page.locator('[data-sonner-toast][data-type="error"]');

test.describe(
  "Organizations list API — errors and empty catalog",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    test("List API failure shows error toast and empty state", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      await page.route(ORGANIZATIONS_LIST_ROUTE, async (route) => {
        if (route.request().method() !== "GET") {
          await route.continue();
          return;
        }
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({
            detail: "E2E: organizations list request failed.",
          }),
        });
      });

      await page.goto("/organizations");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        getEnglishText("i18n.pages.organizations.index.header_title")
      );

      const toast = errorToasts(page).first();
      await expect(toast).toBeVisible({ timeout: 15000 });
      await expect(toast).toContainText(
        /E2E: organizations list request failed/i
      );

      await expect(page.getByTestId("empty-state")).toBeVisible({
        timeout: 15000,
      });
    });

    test("Successful empty list shows empty state without error toast", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      await page.route(ORGANIZATIONS_LIST_ROUTE, async (route) => {
        if (route.request().method() !== "GET") {
          await route.continue();
          return;
        }
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            count: 0,
            next: null,
            previous: null,
            results: [],
          }),
        });
      });

      await page.goto("/organizations");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        getEnglishText("i18n.pages.organizations.index.header_title")
      );

      await expect(page.getByTestId("empty-state")).toBeVisible({
        timeout: 15000,
      });

      await expect(errorToasts(page)).toHaveCount(0);
    });
  }
);
