// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Event detail fetch failures surface as Nuxt **error.vue** (status + message + return home),
 * not the about template. `useGetEvent` still calls `showToastError` before rethrowing, but
 * the fatal error page is what users see. See p0-e2e-tests-to-write.md §5.
 */
import type { Page } from "@playwright/test";

import { expect, test } from "~/test-e2e/global-fixtures";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

/** Stable UUID; list GET uses `/events/events?…` (no trailing id). */
const MOCK_EVENT_ID = "00000000-0000-4000-8000-00000000e2e1";

function isPublicEventDetailGet(url: string): boolean {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\/api\/public\/events\/events\/([^/?#]+)$/);
    if (!m?.[1]) return false;
    return /^[0-9a-f-]{36}$/i.test(m[1]);
  } catch {
    return false;
  }
}

/** Matches `app/error.vue`: large status code, message body, return-home CTA. */
async function expectNuxtFatalErrorPage(
  page: Page,
  expectedStatus: number,
  messageMatcher: RegExp
) {
  await expect(
    page.getByText(String(expectedStatus), { exact: true })
  ).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(messageMatcher)).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole("link", { name: /return.*home/i })).toBeVisible();
}

async function routeMockEventDetail(
  page: Page,
  status: number,
  body: Record<string, unknown>
) {
  await page.route("**/api/public/events/events/**", async (route) => {
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }
    if (!isPublicEventDetailGet(route.request().url())) {
      await route.continue();
      return;
    }
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}

test.describe(
  "Event about — API errors",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    test("Get event 500 shows fatal error page with API message", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      await routeMockEventDetail(page, 500, {
        detail: "E2E: event detail request failed.",
      });

      await page.goto(`/events/${MOCK_EVENT_ID}/about`);

      await expectNuxtFatalErrorPage(
        page,
        500,
        /E2E: event detail request failed/i
      );
    });

    test("Not found (404) shows fatal error page with API detail", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      await routeMockEventDetail(page, 404, {
        detail: "E2E: no event with this identifier.",
      });

      await page.goto(`/events/${MOCK_EVENT_ID}/about`);

      await expectNuxtFatalErrorPage(
        page,
        404,
        /E2E: no event with this identifier/i
      );
    });

    test("Forbidden (403) shows fatal error page with API detail", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      await routeMockEventDetail(page, 403, {
        detail: "E2E: you cannot view this event.",
      });

      await page.goto(`/events/${MOCK_EVENT_ID}/about`);

      await expectNuxtFatalErrorPage(
        page,
        403,
        /E2E: you cannot view this event/i
      );
    });
  }
);
