// SPDX-License-Identifier: AGPL-3.0-or-later
import { newEventsFilter } from "~/test-e2e/component-objects/EventsFilter";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { expect, test } from "~/test-e2e/global-fixtures";
import { logTestPath, withTestStep } from "~/test-e2e/utils/test-traceability";

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
        await page.evaluate(() => {
          const container = document.querySelector(
            "[class*='overflow-y-scroll']"
          ) as HTMLElement | null;
          if (container) container.scrollTo(0, container.scrollHeight);
        });

        // Events auto-paginate on load, so assert the resulting count rather
        // than a specific page response, which may already have fired.
        await expect
          .poll(() => eventCards.count(), { timeout: 8000 })
          .toBeGreaterThan(10);
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
        await page.evaluate(() => {
          const container = document.querySelector(
            "[class*='overflow-y-scroll']"
          ) as HTMLElement | null;
          if (container) container.scrollTo(0, container.scrollHeight);
        });

        await expect
          .poll(() => eventCards.count(), { timeout: 8000 })
          .toBeGreaterThan(10);
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

        await page.evaluate(() => {
          const container = document.querySelector(
            "[class*='overflow-y-scroll']"
          ) as HTMLElement | null;
          if (container) container.scrollTo(0, container.scrollHeight);
        });

        await expect
          .poll(() => eventCards.count(), { timeout: 8000 })
          .toBeGreaterThan(10);

        const titles = await eventCards.evaluateAll((nodes) =>
          nodes.map((item) => item.textContent?.trim())
        );
        const uniqueTitles = new Set(titles);
        expect(uniqueTitles.size).toEqual(titles.length);
      }
    );
  });
});
