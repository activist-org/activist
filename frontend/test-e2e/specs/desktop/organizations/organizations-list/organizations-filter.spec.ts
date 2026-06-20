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

  const sidebarLeft = newSidebarLeft(page);
  await sidebarLeft.open();
});

test.describe("Organizations Filter Component", { tag: "@desktop" }, () => {
  // MARK: City Filter

  test("should filter organizations by city search", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    const organizationsFilter = newOrganizationsFilter(page);

    await withTestStep(
      testInfo,
      "Search for organizations by city",
      async () => {
        const cityInput = organizationsFilter.getCityInput();
        await expect(cityInput).toBeVisible();

        await cityInput.fill("Berlin");
        await cityInput.blur();

        await page.waitForURL(/city=Berlin/, { timeout: 5000 });
        await expect(page).toHaveURL(/city=Berlin/);
      }
    );

    await withTestStep(testInfo, "Clear city search", async () => {
      const cityInput = organizationsFilter.getCityInput();
      await cityInput.clear();
      await cityInput.press("Enter");

      await page.waitForURL((url) => !url.toString().includes("city="), {
        timeout: 5000,
      });
      expect(page.url()).not.toMatch(/city=/);
    });
  });

  // MARK: State Persistence

  test("should maintain city filter state on page refresh", async ({
    page,
  }, testInfo) => {
    logTestPath(testInfo);

    const organizationsFilter = newOrganizationsFilter(page);

    await withTestStep(testInfo, "Apply city filter", async () => {
      const cityInput = organizationsFilter.getCityInput();
      await expect(cityInput).toBeVisible();

      await cityInput.fill("Berlin");
      await cityInput.blur();

      await page.waitForURL(/city=Berlin/, { timeout: 5000 });
    });

    await withTestStep(
      testInfo,
      "Refresh page and verify city filter persists",
      async () => {
        await page.reload();

        await expect(page).toHaveURL(/city=Berlin/);

        const sidebarLeft = newSidebarLeft(page);
        await sidebarLeft.open();

        const cityInput = organizationsFilter.getCityInput();
        await expect(cityInput).toHaveValue("Berlin");
      }
    );
  });
});
