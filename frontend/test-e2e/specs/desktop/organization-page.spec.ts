// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";
import { newOrganizationsHomePage } from "~/test-e2e/page-objects/OrganizationsHomePage";

test.beforeEach(async ({ page }) => {
  // Navigate to organizations home page first
  await page.goto("/organizations");
  const organizationsHomePage = newOrganizationsHomePage(page);
  await expect(organizationsHomePage.heading).toHaveText(/organizations/i);

  // Get the href attribute to extract the organization UUID
  const href =
    await organizationsHomePage.organizationLink.getAttribute("href");
  const organizationId = href?.match(/\/organizations\/([a-f0-9-]{36})/)?.[1];

  // Click on the first organization to navigate to its page
  await organizationsHomePage.organizationLink.click();
  // Wait for navigation to the specific organization page
  await page.waitForURL(`**/organizations/${organizationId}/**`);

  const organizationPage = newOrganizationPage(page);
  await expect(organizationPage.heading).toBeVisible();
});

test.describe("Organization Page", { tag: "@desktop" }, () => {
  test("User can share the organization page", async ({ page }) => {
    const organizationPage = newOrganizationPage(page);

    await organizationPage.shareButton.click();

    await expect(organizationPage.shareModal).toBeVisible();

    // Close the modal by clicking the close button
    const closeModalButton = organizationPage.closeModalButton(
      organizationPage.shareModal
    );
    await expect(closeModalButton).toBeVisible();
    await closeModalButton.click({ force: true });

    // Expect the modal to not be visible
    await expect(organizationPage.shareModal).not.toBeVisible();
  });

  test("User can navigate through organization sections on desktop", async ({
    page,
  }) => {
    const organizationPage = newOrganizationPage(page);

    // Ensure sidebar is open for navigation
    await organizationPage.sidebar.open();

    // Verify we start on the About page (desktop auto-redirects to /about)
    await expect(page).toHaveURL(/.*\/organizations\/.*\/about/);
    await expect(organizationPage.aboutPage.aboutCard).toBeVisible();
    await expect(organizationPage.aboutPage.getInvolvedCard).toBeVisible();
    await expect(organizationPage.aboutPage.connectCard).toBeVisible();

    // Navigate to Events section using existing component object
    await organizationPage.menu.eventsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/events/);
    await expect(page.getByText(/events/i)).toBeVisible();

    // Navigate to Groups section
    await organizationPage.menu.groupsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/groups/);

    // Navigate to Resources section
    await organizationPage.menu.resourcesOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/resources/);

    // Navigate to FAQ section
    await organizationPage.menu.questionsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/faq/);

    // Navigate to Discussions section
    await organizationPage.menu.discussionsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/discussions/);

    // Navigate to Affiliates section
    await organizationPage.menu.affiliatesOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/affiliates/);

    // Navigate back to About section
    await organizationPage.menu.aboutOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/about/);
    await expect(organizationPage.aboutPage.getInvolvedCard).toBeVisible();
  });

  test("Desktop automatically redirects to About page", async ({ page }) => {
    // Navigate directly to organization root URL
    const organizationPage = newOrganizationPage(page);
    const currentUrl = page.url();
    const orgId = currentUrl.match(/\/organizations\/([^/]+)/)?.[1];
    if (orgId) {
      await page.goto(`/organizations/${orgId}`);
      // Should auto-redirect to /about on desktop
      await expect(page).toHaveURL(/.*\/organizations\/.*\/about/);
      await expect(organizationPage.aboutPage.getInvolvedCard).toBeVisible();
    }
  });
});
