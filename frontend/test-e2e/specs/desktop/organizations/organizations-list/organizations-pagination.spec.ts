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
  test("should automatically paginate when all results are in viewport", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    const orgCards = page.getByTestId("organization-card");

    await withTestStep(
      testInfo,
      "Scroll the layout container to trigger loading more organizations",
      async () => {
        await page.evaluate(() => {
          const container = document.querySelector(
            ".\\!overflow-y-scroll, [class*='overflow-y-scroll']"
          ) as HTMLElement | null;
          if (container) {
            container.scrollTo(0, container.scrollHeight);
          }
        });

        await page.waitForLoadState("networkidle");

        const totalCount = await orgCards.count();
        expect(totalCount).toBeGreaterThan(10);
      }
    );

    await withTestStep(
      testInfo,
      "Ensure no duplicate organizations appear after pagination",
      async () => {
        const titles = await orgCards.evaluateAll((nodes) =>
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

    const orgCards = page.getByTestId("organization-card");

    await withTestStep(
      testInfo,
      "Scroll container to trigger all organizations to load via pagination",
      async () => {
        const page2Response = page.waitForResponse(
          (resp) =>
            resp.url().includes("/organizations") &&
            resp.url().includes("page=2") &&
            resp.status() === 200,
          { timeout: 8000 }
        );

        await page.evaluate(() => {
          const container = document.querySelector(
            "[class*='overflow-y-scroll']"
          ) as HTMLElement | null;
          if (container) container.scrollTo(0, container.scrollHeight);
        });

        await page2Response;
        const totalCount = await orgCards.count();
        expect(totalCount).toBeGreaterThan(10);
      }
    );

    await withTestStep(
      testInfo,
      "Apply city filter and verify results reset to first page",
      async () => {
        const sidebarLeft = newSidebarLeft(page);
        await sidebarLeft.open();

        const organizationsFilter = newOrganizationsFilter(page);
        const cityInput = organizationsFilter.getCityInput();
        await expect(cityInput).toBeVisible();

        await cityInput.fill("Berlin");
        await cityInput.blur();

        await page.waitForURL(/city=Berlin/, { timeout: 5000 });
        await page.waitForLoadState("networkidle");

        const filteredCount = await orgCards.count();
        expect(filteredCount).toBeLessThanOrEqual(10);
      }
    );

    await withTestStep(
      testInfo,
      "Navigate to unfiltered list and verify pagination resumes",
      async () => {
        await page.goto("/organizations");
        await page.waitForLoadState("networkidle");

        const page2Response = page.waitForResponse(
          (resp) =>
            resp.url().includes("/organizations") &&
            resp.url().includes("page=2") &&
            resp.status() === 200,
          { timeout: 8000 }
        );

        await page.evaluate(() => {
          const container = document.querySelector(
            "[class*='overflow-y-scroll']"
          ) as HTMLElement | null;
          if (container) container.scrollTo(0, container.scrollHeight);
        });

        await page2Response;

        const resetCount = await orgCards.count();
        expect(resetCount).toBeGreaterThan(10);

        const titles = await orgCards.evaluateAll((nodes) =>
          nodes.map((item) => item.textContent?.trim())
        );
        const uniqueTitles = new Set(titles);
        expect(uniqueTitles.size).toEqual(titles.length);
      }
    );
  });
});
