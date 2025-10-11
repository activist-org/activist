// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";

test.beforeEach(async ({ page }) => {
  // Use shared navigation function that automatically detects platform and uses appropriate navigation.
  await navigateToOrganizationSubpage(page, "events");
});

test.describe(
  "Organization Events Page - Interactions",
  { tag: ["@desktop", "@mobile"] },
  () => {
    // MARK: CREATE EVENT

    test("User can access new event creation", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const { eventsPage } = organizationPage;

      // Verify new event button is visible and functional.
      await expect(eventsPage.eventsNewButton).toBeVisible();
      await expect(eventsPage.eventsNewButton).toHaveAttribute("href", /.+/);

      // Note: We don't click it as it would navigate away from the current page
      // and we want to keep the test focused on the events page functionality.
    });

    // MARK: SUBSCRIBE

    test("User can access events subscription", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const { eventsPage } = organizationPage;

      // Verify subscribe button is visible and clickable.
      await expect(eventsPage.eventsSubscribeButton).toBeVisible();
      await expect(eventsPage.eventsSubscribeButton).toBeEnabled();

      // Click the subscribe button (this should trigger calendar download).
      await eventsPage.eventsSubscribeButton.click();

      // Note: The actual download functionality is handled by the browser
      // and testing file downloads requires special configuration.
    });

    test("User can access subscribe button in tooltip menu", async ({
      page,
    }) => {
      const organizationPage = newOrganizationPage(page);
      const { eventsPage } = organizationPage;

      const eventCount = await eventsPage.getEventCount();

      if (eventCount > 0) {
        // Open the tooltip menu for the first event.
        const menuButton = eventsPage.getEventMenuButton(0);
        await expect(menuButton).toBeVisible();
        await menuButton.click();

        // Verify tooltip menu appears.
        const menuTooltip = eventsPage.getEventMenuTooltip(0);
        await expect(menuTooltip).toBeVisible();

        // Verify subscribe button exists and is clickable.
        const subscribeButton = eventsPage.getEventSubscribeButton(0);
        await expect(subscribeButton).toBeVisible();
        await expect(subscribeButton).toBeEnabled();

        // Click subscribe button (this should trigger calendar download).
        await subscribeButton.click();

        // Note: The actual download functionality is handled by the browser
        // and testing file downloads requires special configuration.
        // We just verify the button is functional and clickable.
      } else {
        // Skip test if no events are available.
        test.skip(eventCount > 0, "No events available to test subscription");
      }
    });

    // MARK: SHARE EVENT

    test("User can share the organization event", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const { eventsPage, shareModal } = organizationPage;

      const eventCount = await eventsPage.getEventCount();

      if (eventCount > 0) {
        // Open the tooltip menu for the first event.
        const menuButton = eventsPage.getEventMenuButton(0);
        await expect(menuButton).toBeVisible();
        await menuButton.click();

        // Verify tooltip menu appears.
        const menuTooltip = eventsPage.getEventMenuTooltip(0);
        await expect(menuTooltip).toBeVisible();

        // Verify share button exists and is clickable.
        const shareButton = eventsPage.getEventShareButton(0);
        await expect(shareButton).toBeVisible();
        await expect(shareButton).toBeEnabled();

        // Click share button to open share modal.
        await shareButton.click();

        // Verify share modal opens.
        await expect(shareModal.modal).toBeVisible();

        // Close the modal.
        const closeButton = shareModal.closeButton(shareModal.modal);
        await expect(closeButton).toBeVisible();
        await closeButton.click();
        // Verify modal closes.
        await expect(shareModal.modal).not.toBeVisible();
      } else {
        // Skip test if no events are available.
        test.skip(eventCount > 0, "No events available to test sharing");
      }
    });
  }
);
