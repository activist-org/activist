// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * When the events catalog has active URL filters but the list API returns an empty page
 * for that query, the UI should show EmptyState without an error toast (see #2145 / #1983).
 */
import type { Page } from "@playwright/test";

import { expect, test } from "~/test-e2e/global-fixtures";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

/** Public list endpoint used by `listEvents` (`withoutAuth: true` → /api/public). */
const EVENTS_LIST_ROUTE = "**/api/public/events/events**";

/** Distinct `location` query value so we only mock the filtered list request, not other traffic. */
const FILTER_LOCATION_MARKER = "E2E_FilteredEmpty_Location_9f3a1b";

const errorToasts = (page: Page) =>
  page.locator('[data-sonner-toast][data-type="error"]');

function listRequestHasFilteredLocation(url: string): boolean {
  try {
    const u = new URL(url);
    if (!u.pathname.includes("/api/public/events/events")) return false;
    const loc = u.searchParams.get("location");
    return loc === FILTER_LOCATION_MARKER;
  } catch {
    return false;
  }
}

test.describe(
  "Events list — filtered query returns empty results",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    test("Empty 200 list for active location filter shows empty state without error toast", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      await page.route(EVENTS_LIST_ROUTE, async (route) => {
        if (route.request().method() !== "GET") {
          await route.continue();
          return;
        }
        if (!listRequestHasFilteredLocation(route.request().url())) {
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
        `/events?view=list&location=${encodeURIComponent(FILTER_LOCATION_MARKER)}`
      );
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        /events/i
      );

      await expect(page.getByTestId("empty-state")).toBeVisible({
        timeout: 15000,
      });
      await expect(errorToasts(page)).toHaveCount(0);
    });
  }
);
