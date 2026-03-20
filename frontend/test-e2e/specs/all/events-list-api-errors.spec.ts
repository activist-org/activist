// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Canonical E2E for the shared “list composable” failure pattern: GET list fails →
 * toast + EmptyState (same UX as a true empty catalog). See p0-e2e-tests-to-write.md §4.
 */
import type { Page } from "@playwright/test";

import { expect, test } from "~/test-e2e/global-fixtures";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

/** Public list endpoint used by `listEvents` (`withoutAuth: true` → /api/public). */
const EVENTS_LIST_ROUTE = "**/api/public/events/events**";

const errorToasts = (page: Page) =>
  page.locator('[data-sonner-toast][data-type="error"]');

test.describe(
  "Events list API — errors and empty catalog",
  { tag: ["@desktop", "@mobile"] },
  () => {
  test.afterEach(async ({ page }) => {
    await page.unrouteAll();
  });

  test("List API failure shows error toast and empty state", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    await page.route(EVENTS_LIST_ROUTE, async (route) => {
      if (route.request().method() !== "GET") {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          detail: "E2E: events list request failed.",
        }),
      });
    });

    await withTestStep(testInfo, "Load events list (list view)", async () => {
      await page.goto("/events?view=list");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(/events/i);
    });

    await withTestStep(testInfo, "Assert error toast message", async () => {
      const toast = errorToasts(page).first();
      await expect(toast).toBeVisible({ timeout: 15000 });
      await expect(toast).toContainText(/E2E: events list request failed/i);
    });

    await withTestStep(
      testInfo,
      "Assert empty state (same shell as zero-result success)",
      async () => {
        await expect(page.getByTestId("empty-state")).toBeVisible({
          timeout: 15000,
        });
      }
    );
  });

  test("Successful empty list shows empty state without error toast", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    await page.route(EVENTS_LIST_ROUTE, async (route) => {
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

    await withTestStep(testInfo, "Load events list (list view)", async () => {
      await page.goto("/events?view=list");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(/events/i);
    });

    await withTestStep(testInfo, "Assert empty state for zero results", async () => {
      await expect(page.getByTestId("empty-state")).toBeVisible({
        timeout: 15000,
      });
    });

    await withTestStep(testInfo, "Assert no error toast", async () => {
      await expect(errorToasts(page)).toHaveCount(0);
    });
  });
});
