// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * When the organizations catalog has active URL filters but the list API returns an empty page
 * for that query, the UI should show EmptyState without an error toast (see #2145 / #1983).
 */
import type { Page } from "@playwright/test";

import { getEnglishText } from "#shared/utils/i18n";

import { expect, test } from "~/test-e2e/global-fixtures";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

/** Public list endpoint used by `listOrganizations` (`withoutAuth: true` → /api/public). */
const ORGANIZATIONS_LIST_ROUTE = "**/api/public/communities/organizations**";

/**
 * Distinct `city` query value so we only mock the filtered list request, not other traffic.
 * `city` maps to `OrganizationFilters` via the sidebar filter form.
 */
const FILTER_CITY_MARKER = "E2E_FilteredEmpty_City_7c2d4e";

/** Minimal org shape valid for `mapOrganization` — all nullable fields default to []. */
const MINIMAL_ORG_RESULT = {
  id: "00000000-0000-4000-8001-000000000002",
  orgName: "E2E non-empty filter test org",
  name: "E2E non-empty filter test org",
  socialLinks: [],
  status: 1,
  texts: [],
};

const errorToasts = (page: Page) =>
  page.locator('[data-sonner-toast][data-type="error"]');

function listRequestHasCityMarker(url: string): boolean {
  try {
    const u = new URL(url);
    if (!u.pathname.includes("/api/public/communities/organizations")) {
      return false;
    }
    return u.searchParams.get("city") === FILTER_CITY_MARKER;
  } catch {
    return false;
  }
}

test.describe(
  "Organizations list — filtered query returns empty results",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    test("Empty 200 list for active city filter shows empty state without error toast", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      await page.route(ORGANIZATIONS_LIST_ROUTE, async (route) => {
        if (route.request().method() !== "GET") {
          await route.continue();
          return;
        }
        if (!listRequestHasCityMarker(route.request().url())) {
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

      await page.goto(
        `/organizations?city=${encodeURIComponent(FILTER_CITY_MARKER)}`
      );
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        getEnglishText("i18n.pages.organizations.index.header_title")
      );

      await expect(page.getByTestId("empty-state")).toBeVisible({
        timeout: 15000,
      });
      await expect(errorToasts(page)).toHaveCount(0, { timeout: 3000 });
    });

    test("Non-empty 200 list for active city filter does not show empty state", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      await page.route(ORGANIZATIONS_LIST_ROUTE, async (route) => {
        if (route.request().method() !== "GET") {
          await route.continue();
          return;
        }
        if (!listRequestHasCityMarker(route.request().url())) {
          await route.continue();
          return;
        }
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            count: 1,
            next: null,
            previous: null,
            results: [MINIMAL_ORG_RESULT],
          }),
        });
      });

      await page.goto(
        `/organizations?city=${encodeURIComponent(FILTER_CITY_MARKER)}`
      );
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        getEnglishText("i18n.pages.organizations.index.header_title")
      );

      await expect(page.getByTestId("empty-state")).not.toBeVisible({
        timeout: 15000,
      });
    });
  }
);
