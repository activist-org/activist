// SPDX-License-Identifier: AGPL-3.0-or-later
import { newEventsFilter } from "~/test-e2e/component-objects/EventsFilter";
import { expect, test } from "~/test-e2e/global-fixtures";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test("should load more events on infinite scroll", async ({
  page,
}, testInfo) => {
  logTestPath(testInfo);

  // Get initial visible events count.
  const eventItems = page.getByTestId("event-card");
  const initialCount = await eventItems.count();

  await withTestStep(
    testInfo,
    "Scroll down to trigger loading more events",
    async () => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1500);

      const newCount = await eventItems.count();
      expect(newCount).toBeGreaterThan(initialCount);
    }
  );

  await withTestStep(
    testInfo,
    "Ensure no duplicate events appear after infinite scroll",
    async () => {
      const titles = await eventItems.evaluateAll((nodes) =>
        nodes.map((item) => item.textContent?.trim())
      );
      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toEqual(titles.length);
    }
  );
});

test("should update events and reset infinite scroll on filter, loading paginated amount", async ({
  page,
}, testInfo) => {
  logTestPath(testInfo);
  const eventItems = page.locator(".event-item");

  // Initial (unfiltered) events count.
  const initialEventsCount = await eventItems.count();

  await withTestStep(
    testInfo,
    "Apply a filter and check the events change",
    async () => {
      // Example: Filter by location "Berlin".
      const eventsFilter = newEventsFilter(page);
      const locationInput = eventsFilter.getLocationInput();
      await expect(locationInput).toBeVisible();
      await locationInput.fill("Berlin");
      await locationInput.blur();

      await page.waitForTimeout(1000); // wait for events to reload

      // Events should update.
      const filteredEventsCount = await eventItems.count();
      expect(filteredEventsCount).not.toEqual(initialEventsCount);

      // Confirm that only the "page size" (e.g. 10, 20, etc.) events are visible after filter.
      expect(filteredEventsCount).toBeLessThanOrEqual(10);
    }
  );

  await withTestStep(
    testInfo,
    "Scroll to load more filtered events",
    async () => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1500);

      // The count should increase with next "page" of results.
      const scrolledCount = await eventItems.count();
      expect(scrolledCount).toBeGreaterThan(10);

      // Optionally, check no duplicates after filtering and loading more.
      const titles = await eventItems.evaluateAll((nodes) =>
        nodes.map((item) => item.textContent?.trim())
      );
      const uniqueTitles = new Set(titles);
      expect(uniqueTitles.size).toEqual(titles.length);
    }
  );
});
