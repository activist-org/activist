// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToOrganizationGroupSubpage(page, "about");
});

test.describe(
  "Organization Group About Page - Navigation",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.setTimeout(60000); // group pages load slowly in dev mode

    test("Group about page tab navigation works correctly", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const organizationPage = newOrganizationPage(page);
      const { groupAboutPage } = organizationPage;

      await withTestStep(testInfo, "Navigate to events tab", async () => {
        await groupAboutPage.clickEventsTab();
        await expect(groupAboutPage.eventsTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupAboutPage.aboutTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });

      await withTestStep(testInfo, "Navigate to resources tab", async () => {
        await groupAboutPage.clickResourcesTab();
        await expect(groupAboutPage.resourcesTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupAboutPage.eventsTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });

      await withTestStep(testInfo, "Navigate to FAQ tab", async () => {
        await groupAboutPage.clickFaqTab();
        await expect(groupAboutPage.faqTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupAboutPage.resourcesTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });

      await withTestStep(testInfo, "Return to about tab", async () => {
        await groupAboutPage.clickAboutTab();
        await expect(groupAboutPage.aboutTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupAboutPage.faqTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });
    });

    test("User can share the group page", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupAboutPage } = organizationPage;

      await withTestStep(testInfo, "Open share modal", async () => {
        await groupAboutPage.clickShare();
        await expect(groupAboutPage.shareModal).toBeVisible();
      });

      await withTestStep(testInfo, "Close share modal", async () => {
        const closeModalButton =
          groupAboutPage.shareModal.getByTestId("modal-close-button");
        await expect(closeModalButton).toBeVisible();
        await closeModalButton.click({ force: true });
        // Wait for the modal to actually close.
        await expect(groupAboutPage.shareModal).not.toBeVisible({});
      });
    });
  }
);
