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

test.describe("Organization Page", { tag: "@mobile" }, () => {
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

  test("User can navigate through organization sections on mobile", async ({
    page,
  }) => {
    const organizationPage = newOrganizationPage(page);
    await expect(page).toHaveURL(/.*\/organizations\/.*\/about/);
    await expect(organizationPage.shareButton).toBeVisible();
    await organizationPage.menu.toggleOpenButton.click();

    // Navigate to About section using existing component object
    await organizationPage.menu.aboutOption.click();
    await expect(organizationPage.aboutPage.getInvolvedCard).toBeVisible();

    await organizationPage.menu.toggleOpenButton.click();

    // Navigate to Events section
    await organizationPage.menu.eventsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/events/);
    await expect(organizationPage.eventsPage.newEventButton).toBeVisible();
    await expect(organizationPage.eventsPage.subscribeButton).toBeVisible();

    await organizationPage.menu.toggleOpenButton.click();

    // Navigate to Resources section
    await organizationPage.menu.resourcesOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/resources/);

    await organizationPage.menu.toggleOpenButton.click();

    // Navigate to FAQ section
    await organizationPage.menu.questionsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/faq/);
  });
});
