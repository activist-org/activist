// SPDX-License-Identifier: AGPL-3.0-or-later
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { navigateToFirstEvent } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToFirstEvent(page);

  // Wait for auth state to be fully loaded.
  await page.waitForLoadState("domcontentloaded");

  // Wait for page to be fully loaded (no arbitrary delay).
  await expect(async () => {
    // Verify page is interactive and fully rendered.
    const isReady = await page.evaluate(
      () => document.readyState === "complete"
    );
    expect(isReady).toBe(true);
  }).toPass({
    intervals: [100, 250],
  });
});

test.describe(
  "Event About Page - Accessibility",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.setTimeout(60000); // increased timeout for slow dev mode loading

    test("Event About Page has no detectable accessibility issues", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      await withTestStep(testInfo, "Run accessibility scan", async () => {
        const violations = await runAccessibilityTest(
          "Event About Page",
          page,
          testInfo
        );
        expect
          .soft(violations, "Accessibility violations found:")
          .toHaveLength(0);

        if (violations.length > 0) {
          // Note: For future implementation.
        }
      });
    });

    test("User can share the event page", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const eventPage = newEventPage(page);
      const { shareModal } = eventPage;
      await withTestStep(testInfo, "Open share modal", async () => {
        await eventPage.shareButton.click();
        await expect(shareModal.modal).toBeVisible();
      });
      await withTestStep(testInfo, "Close share modal", async () => {
        const closeModalButton = shareModal.closeButton(shareModal.modal);
        await expect(closeModalButton).toBeVisible();
        await closeModalButton.click({ force: true });
        await expect(shareModal.modal).not.toBeVisible();
      });
    });
  }
);
