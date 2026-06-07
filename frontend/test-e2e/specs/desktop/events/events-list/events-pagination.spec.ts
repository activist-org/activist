// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { newEventsFilter } from "~/test-e2e/component-objects/EventsFilter";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { expect, test } from "~/test-e2e/global-fixtures";
import { logTestPath, withTestStep } from "~/test-e2e/utils/test-traceability";

/**
 * Scroll the list container until pagination loads a second page. A single
 * scroll can fire before the layout settles or land the 1px sentinel exactly on
 * the viewport edge (below the IntersectionObserver threshold), so re-scroll on
 * each poll until the rendered card count grows past one page.
 */
const loadSecondPage = async (page: Page, cards: Locator): Promise<void> => {
  await expect
    .poll(
      async () => {
        await page.evaluate(() => {
          const container = document.querySelector(
            "[class*='overflow-y-scroll']"
          ) as HTMLElement | null;
          if (container) container.scrollTo(0, container.scrollHeight);
        });
        return cards.count();
      },
      { timeout: 15000, intervals: [300, 700, 1000, 1500, 2000] }
    )
    .toBeGreaterThan(10);
};

test.beforeEach(async ({ page }) => {
  await page.goto("/events?view=list");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/events/i);
});

test.describe("Events Pagination", { tag: "@desktop" }, () => {
  test("should automatically paginate when all results are in viewport", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    const eventCards = page.getByTestId("event-card");

    await withTestStep(
      testInfo,
      "Scroll the page to trigger loading more events",
      async () => {
        await loadSecondPage(page, eventCards);
      }
    );

    await withTestStep(
      testInfo,
      "Ensure no duplicate events appear after pagination",
      async () => {
        const titles = await eventCards.evaluateAll((nodes) =>
          nodes.map((item) => item.textContent?.trim())
        );
        const uniqueTitles = new Set(titles);
        expect(uniqueTitles.size).toEqual(titles.length);
      }
    );
  });

  test("should reset pagination and reload on filter change", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    const eventCards = page.getByTestId("event-card");

    await withTestStep(
      testInfo,
      "Scroll the page to trigger all events to load via pagination",
      async () => {
        await loadSecondPage(page, eventCards);
      }
    );

    await withTestStep(
      testInfo,
      "Apply location filter and verify results reset to first page",
      async () => {
        const sidebarLeft = newSidebarLeft(page);
        await sidebarLeft.open();

        const eventsFilter = newEventsFilter(page);
        const locationInput = eventsFilter.getLocationInput();
        await expect(locationInput).toBeVisible();

        await locationInput.fill("Berlin");
        await locationInput.blur();

        await page.waitForURL(/location=Berlin/, { timeout: 5000 });
        await page.waitForLoadState("networkidle");

        const filteredCount = await eventCards.count();
        expect(filteredCount).toBeLessThanOrEqual(10);
      }
    );

    await withTestStep(
      testInfo,
      "Navigate to unfiltered list and verify pagination resumes",
      async () => {
        await page.goto("/events?view=list");
        await page.waitForLoadState("networkidle");

        await loadSecondPage(page, eventCards);

        const titles = await eventCards.evaluateAll((nodes) =>
          nodes.map((item) => item.textContent?.trim())
        );
        const uniqueTitles = new Set(titles);
        expect(uniqueTitles.size).toEqual(titles.length);
      }
    );
  });
});
