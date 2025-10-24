// SPDX-License-Identifier: AGPL-3.0-or-later
import { newEventsFilter } from "~/test-e2e/component-objects/EventsFilter";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { expect, test } from "~/test-e2e/global-fixtures";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  await page.goto("/events?view=list");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/events/i);

  // Ensure sidebar is open to access filters.
  const sidebarLeft = newSidebarLeft(page);
  await sidebarLeft.open();
});

test.describe("Events Filter Component", { tag: "@desktop" }, () => {
  // MARK: View Types

  test("should switch between view types (list, map, calendar)", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    const eventsFilter = newEventsFilter(page);

    await withTestStep(testInfo, "Switch to map view", async () => {
      const mapButton = eventsFilter.viewTypeSection.getByRole("radio", {
        name: /^map\s+(view|list)$/i,
      });
      await expect(mapButton).toBeVisible();
      await mapButton.click();

      // Verify URL updates with view parameter.
      await expect(page).toHaveURL(/view=map/);
    });

    await withTestStep(testInfo, "Switch to calendar view", async () => {
      const calendarButton = eventsFilter.viewTypeSection.getByRole("radio", {
        name: /calendar/i,
      });
      await expect(calendarButton).toBeVisible();
      await calendarButton.click();

      // Verify URL updates with view parameter.
      await expect(page).toHaveURL(/view=calendar/);
    });

    await withTestStep(testInfo, "Switch back to list view", async () => {
      const listButton = eventsFilter.viewTypeSection.getByRole("radio", {
        name: /^list\s+view$/i,
      });
      await expect(listButton).toBeVisible();
      await listButton.click();

      // Verify URL updates with view parameter.
      await expect(page).toHaveURL(/view=list/);
    });
  });

  // MARK: Location Search

  // This filter is not yet implemented.
  test("should filter events by location search", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    const eventsFilter = newEventsFilter(page);

    await withTestStep(testInfo, "Search for events by location", async () => {
      const locationInput = eventsFilter.getLocationInput();
      await expect(locationInput).toBeVisible();

      // Enter location search term.
      await locationInput.fill("Berlin");
      await locationInput.blur(); // Trigger onChange event.

      // Verify URL updates with location parameter.
      await page.waitForURL(/location=Berlin/, { timeout: 5000 });
      await expect(page).toHaveURL(/location=Berlin/);
    });

    await withTestStep(testInfo, "Clear location search", async () => {
      const locationInput = eventsFilter.getLocationInput();
      await locationInput.clear();
      await locationInput.blur();

      // Verify location parameter is removed from URL.
      await page.waitForTimeout(500); // Brief wait for URL update.
      expect(page.url()).not.toMatch(/location=/);
    });
  });

  // MARK: Multiple Filters

  test("should apply multiple filters simultaneously", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    const eventsFilter = newEventsFilter(page);

    await withTestStep(testInfo, "Apply multiple filters at once", async () => {
      // Calculate expected date (7 days from now).
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() + 7);
      const expectedDateStr = expectedDate.toISOString().split("T")[0]; // YYYY-MM-DD format.

      // Set days ahead filter.
      const sevenDaysButton = eventsFilter.daysSection.getByRole("radio", {
        name: /7/i,
      });
      await sevenDaysButton.click();

      // Set event type filter.
      const learnButton = eventsFilter.eventTypeSection.getByRole("radio", {
        name: /learn/i,
      });
      await learnButton.click();

      // Set location type filter.
      const onlineButton = eventsFilter.locationTypeSection.getByRole("radio", {
        name: /online/i,
      });
      await onlineButton.click();

      // Verify all filters are applied in URL.
      await page.waitForURL(/active_on=.*type=learn.*setting=online/, {
        timeout: 5000,
      });

      // Verify filter parameters.
      await expect(page).toHaveURL(/type=learn/);
      await expect(page).toHaveURL(/setting=online/);

      // Verify active_on date is approximately 7 days from now.
      const url = new URL(page.url());
      const activeOnParam = url.searchParams.get("active_on");
      expect(activeOnParam).toBeTruthy();

      if (activeOnParam) {
        const activeOnDate = new Date(activeOnParam);
        const activeOnDateStr = activeOnDate.toISOString().split("T")[0];

        // Verify the date matches (allow for same day due to timing).
        expect(activeOnDateStr).toBe(expectedDateStr);
      }
    });
  });

  // MARK: State Persistence

  test("should maintain filter state on page refresh", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    const eventsFilter = newEventsFilter(page);

    await withTestStep(testInfo, "Apply multiple filters", async () => {
      // Set days ahead filter.
      const sevenDaysButton = eventsFilter.daysSection.getByRole("radio", {
        name: /7/i,
      });
      await sevenDaysButton.click();

      // Set event type filter.
      const actionButton = eventsFilter.eventTypeSection.getByRole("radio", {
        name: /action/i,
      });
      await actionButton.click();

      // Set location type filter.
      const offlineButton = eventsFilter.locationTypeSection.getByRole(
        "radio",
        {
          name: /person|offline/i,
        }
      );
      await offlineButton.click();

      // Wait for all filters to be applied.
      await page.waitForURL(/active_on=.*type=action.*setting=offline/, {
        timeout: 5000,
      });
    });

    await withTestStep(
      testInfo,
      "Refresh page and verify all filters persist",
      async () => {
        await page.reload();

        // Verify URL still contains all filter parameters.
        await expect(page).toHaveURL(/active_on=/);
        await expect(page).toHaveURL(/type=action/);
        await expect(page).toHaveURL(/setting=offline/);

        // Verify all filter buttons are still selected.
        const sevenDaysButton = eventsFilter.daysSection.getByRole("radio", {
          name: /7/i,
        });
        await expect(sevenDaysButton).toBeChecked();

        const actionButton = eventsFilter.eventTypeSection.getByRole("radio", {
          name: /action/i,
        });
        await expect(actionButton).toBeChecked();

        const offlineButton = eventsFilter.locationTypeSection.getByRole(
          "radio",
          {
            name: /person|offline/i,
          }
        );
        await expect(offlineButton).toBeChecked();
      }
    );
  });
});
