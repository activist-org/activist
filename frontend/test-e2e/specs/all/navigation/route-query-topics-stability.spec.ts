// SPDX-License-Identifier: AGPL-3.0-or-later
import { newEventsFilter } from "~/test-e2e/component-objects/EventsFilter";
import { newSidebarLeft } from "~/test-e2e/component-objects/SidebarLeft";
import { expect, test } from "~/test-e2e/global-fixtures";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.describe(
  "Route Query Topics Stability",
  {
    tag: ["@desktop", "@mobile"],
  },
  () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/events?view=map");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        /events/i
      );
    });

    test("should keep topics in URL after selecting from sidebar filter", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const sidebarLeft = newSidebarLeft(page);
      const eventsFilter = newEventsFilter(page);

      await withTestStep(
        testInfo,
        "Open sidebar and select a topic filter",
        async () => {
          await sidebarLeft.open();

          // Click the topics combobox button to open dropdown.
          const topicsSection = eventsFilter.topicsSection;
          const topicsComboboxButton = topicsSection.getByRole("button", {
            name: /topics/i,
          });
          await expect(topicsComboboxButton).toBeVisible();
          await topicsComboboxButton.click();

          // Wait for options to appear and select a topic.
          const topicOption = page.getByRole("option", {
            name: /environment/i,
          });
          await expect(topicOption).toBeVisible({ timeout: 5000 });

          // Click the option and wait for URL to update.
          await Promise.all([
            topicOption.click(),
            page.waitForURL(/topics=/, { timeout: 5000 }),
          ]);
        }
      );

      await withTestStep(
        testInfo,
        "Verify URL contains topics and remains stable",
        async () => {
          // Wait for any pending navigation to complete.
          await page
            .waitForLoadState("networkidle", { timeout: 5000 })
            .catch(() => {
              // Ignore timeout - networkidle is optional.
            });
          await page.waitForLoadState("domcontentloaded");

          // Wait additional time to ensure URL is stable.
          await page.waitForTimeout(2000);

          // Verify URL contains topics parameter and remains stable.
          await expect(async () => {
            const url = page.url();
            if (!url.includes("topics=")) {
              throw new Error(`URL does not contain topics=: ${url}`);
            }
          }).toPass({ timeout: 1000 });

          // Final verification.
          await expect(page).toHaveURL(/topics=/);
          const url = page.url();
          expect(url).toMatch(/topics=ENVIRONMENT/);
          expect(url).toContain("view=map");
        }
      );
    });

    test("should keep multiple topics in URL after selecting multiple from sidebar filter", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const sidebarLeft = newSidebarLeft(page);
      const eventsFilter = newEventsFilter(page);

      await withTestStep(
        testInfo,
        "Open sidebar and select first topic",
        async () => {
          await sidebarLeft.open();

          // Click the topics combobox button to open dropdown.
          const topicsSection = eventsFilter.topicsSection;
          const topicsComboboxButton = topicsSection.getByRole("button", {
            name: /topics/i,
          });
          await expect(topicsComboboxButton).toBeVisible();
          await topicsComboboxButton.click();

          // Select first topic (e.g., Environment).
          const environmentOption = page.getByRole("option", {
            name: /environment/i,
          });
          await expect(environmentOption).toBeVisible({ timeout: 5000 });
          await environmentOption.click();

          // Wait for URL to update with first topic.
          await page.waitForURL(/topics=/, { timeout: 5000 });
          await page.waitForLoadState("domcontentloaded");
        }
      );

      await withTestStep(
        testInfo,
        "Select second topic and verify both topics are in URL",
        async () => {
          // Click the button again to open dropdown (it should still be open or we reopen it).
          const topicsSection = eventsFilter.topicsSection;
          const topicsComboboxButton = topicsSection.getByRole("button", {
            name: /topics/i,
          });

          // Check if dropdown is still open, if not, click to reopen.
          const healthOption = page.getByRole("option", {
            name: /health/i,
          });
          const isVisible = await healthOption.isVisible().catch(() => false);

          if (!isVisible) {
            await topicsComboboxButton.click();
            await page.waitForTimeout(300);
          }

          // Select second topic (e.g., Health).
          await expect(healthOption).toBeVisible({ timeout: 5000 });
          await healthOption.click();

          // Wait for URL to update with both topics.
          await page
            .waitForLoadState("networkidle", { timeout: 5000 })
            .catch(() => {});
          await page.waitForLoadState("domcontentloaded");
          await page.waitForTimeout(2000);
        }
      );

      await withTestStep(
        testInfo,
        "Verify URL contains both topics and remains stable",
        async () => {
          // Wait additional time to ensure URL is stable.
          await page.waitForTimeout(2000);

          // Verify URL contains topics parameter and remains stable.
          await expect(async () => {
            const url = page.url();
            const urlHasEnvironment = url.includes("ENVIRONMENT");
            const urlHasHealth = url.includes("HEALTH");

            if (!url.includes("topics=")) {
              throw new Error(`URL does not contain topics=: ${url}`);
            }
            if (!urlHasEnvironment) {
              throw new Error(`URL does not contain ENVIRONMENT topic: ${url}`);
            }
            if (!urlHasHealth) {
              throw new Error(`URL does not contain HEALTH topic: ${url}`);
            }
          }).toPass({ timeout: 5000 });

          // Final verification - check for both topics.
          await expect(page).toHaveURL(/topics=/);
          const url = page.url();

          // Verify both topics are present in the URL.
          expect(url).toMatch(/topics=/);
          expect(url).toContain("ENVIRONMENT");
          expect(url).toContain("HEALTH");
          expect(url).toContain("view=map");

          // Parse URL to verify topics array structure.
          const urlObj = new URL(url);
          const topicsParam = urlObj.searchParams.getAll("topics");

          // Topics should be present as an array.
          expect(topicsParam.length).toBeGreaterThanOrEqual(1);
          expect(topicsParam).toContain("ENVIRONMENT");
          expect(topicsParam).toContain("HEALTH");
        }
      );
    });
  }
);
