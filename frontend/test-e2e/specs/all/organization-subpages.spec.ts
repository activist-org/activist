// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test, type TestInfo } from "playwright/test";
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

// This test covers organization subpages: about, events, groups
// Checks: modal functionality, hydration indicator, accessibility scan

test.describe("Organization subpages - shared checks", { tag: "@all" }, () => {
  const orgId = "1";
  const subpages = [
    { path: `/organizations/${orgId}/about`, name: /about/i },
    { path: `/organizations/${orgId}/events`, name: /events/i },
    { path: `/organizations/${orgId}/groups`, name: /groups/i },
  ];

  for (const pageInfo of subpages) {
    test(`${pageInfo.path} - modal, hydration, accessibility`, async ({ page }, testInfo: TestInfo) => {
      logTestPath(testInfo);

      await withTestStep(testInfo, `Go to ${pageInfo.path}`, async () => {
        await page.goto(pageInfo.path);
        // Basic sanity: land on the expected heading
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      });

      await withTestStep(testInfo, "Modal functionality", async () => {
        const maybeShare = page
          .getByRole("link", { name: /Navigate to the page for this organization/i })
          .locator("xpath=following-sibling::div")
          .getByRole("button")
          .first();

        if (await maybeShare.count() > 0) {
          await maybeShare.click();
          await expect(maybeShare.locator("div.tooltip")).toBeVisible();
          await maybeShare.locator("div.tooltip").locator("button").click();

          const shareModal = page.locator("#search-modal").first();
          await expect(shareModal).toBeVisible();
        } else {
          // If the share button isn't present, try opening a generic modal trigger if one exists
          const modalTrigger = page.getByRole("button", { name: /open modal|more actions/i }).first();
          if (await modalTrigger.count() > 0) {
            await modalTrigger.click();
            await expect(page.locator("dialog, .modal, #search-modal").first()).toBeVisible();
          }
        }
      });

      await withTestStep(testInfo, "Hydration check", async () => {
        const hydratedSelectors = [
          '[data-hydrated="true"]',
          '[data-server-rendered="false"]',
          '[data-vue-meta-client]'
        ];

        let hydrated = false;
        for (const sel of hydratedSelectors) {
          const count = await page.locator(sel).count();
          if (count > 0) {
            hydrated = true;
            break;
          }
        }

        expect(hydrated, "page should show a client-side hydration marker").toBeTruthy();
      });

      await withTestStep(testInfo, "Accessibility scan", async () => {
        const violations = await runAccessibilityTest(pageInfo.path, page, testInfo);
        expect.soft(violations, `Accessibility violations on ${pageInfo.path}`).toHaveLength(0);
      });
    },
    { timeout: 120000 }
    );
  }
});
