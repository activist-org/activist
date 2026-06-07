// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "#shared/utils/i18n";

import { newOrganizationsFilter } from "~/test-e2e/component-objects/OrganizationsFilter";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { expect, test } from "~/test-e2e/global-fixtures";
import { logTestPath, withTestStep } from "~/test-e2e/utils/test-traceability";

test.beforeEach(async ({ page }) => {
  await page.goto("/organizations");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    getEnglishText("i18n.pages.organizations.index.header_title")
  );
});

test.describe("Organizations Pagination", { tag: "@desktop" }, () => {
  test("should load more organizations on infinite scroll", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    const orgCards = page.getByTestId("organization-card");
    const initialCount = await orgCards.count();

    await withTestStep(
      testInfo,
      "Scroll down to trigger loading more organizations",
      async () => {
        await page.evaluate(() =>
          window.scrollTo(0, document.body.scrollHeight)
        );
        await page.waitForTimeout(1500);

        const newCount = await orgCards.count();
        expect(newCount).toBeGreaterThan(initialCount);
      }
    );

    await withTestStep(
      testInfo,
      "Ensure no duplicate organizations appear after infinite scroll",
      async () => {
        const ids = await orgCards.evaluateAll((nodes) =>
          nodes.map(
            (item) => item.getAttribute("data-id") ?? item.textContent?.trim()
          )
        );
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toEqual(ids.length);
      }
    );
  });

  test("should update organizations and reset infinite scroll on filter", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    const orgCards = page.getByTestId("organization-card");
    const initialCount = await orgCards.count();

    await withTestStep(
      testInfo,
      "Apply city filter and check organizations change",
      async () => {
        const sidebarLeft = newSidebarLeft(page);
        await sidebarLeft.open();

        const organizationsFilter = newOrganizationsFilter(page);
        const cityInput = organizationsFilter.getCityInput();
        await expect(cityInput).toBeVisible();

        await cityInput.fill("Berlin");
        await cityInput.blur();

        await page.waitForURL(/city=Berlin/, { timeout: 5000 });
        await page.waitForTimeout(1000);

        const filteredCount = await orgCards.count();
        expect(filteredCount).not.toEqual(initialCount);
        expect(filteredCount).toBeLessThanOrEqual(10);
      }
    );

    await withTestStep(
      testInfo,
      "Scroll to load more filtered organizations",
      async () => {
        await page.evaluate(() =>
          window.scrollTo(0, document.body.scrollHeight)
        );
        await page.waitForTimeout(1500);

        const scrolledCount = await orgCards.count();
        expect(scrolledCount).toBeGreaterThan(10);

        const ids = await orgCards.evaluateAll((nodes) =>
          nodes.map(
            (item) => item.getAttribute("data-id") ?? item.textContent?.trim()
          )
        );
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toEqual(ids.length);
      }
    );
  });
});
