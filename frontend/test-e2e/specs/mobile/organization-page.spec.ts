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

  test("Mobile shows organization navigation menu", async ({ page }) => {
    const organizationPage = newOrganizationPage(page);

    // On mobile, should show the mobile navigation interface
    // Verify organization name and tagline are visible
    await expect(organizationPage.heading).toBeVisible();

    // Verify mobile navigation menu options are present using existing component object
    await expect(organizationPage.menu.aboutOption).toBeVisible();
    await expect(organizationPage.menu.eventsOption).toBeVisible();
    await expect(organizationPage.menu.groupsOption).toBeVisible();

    // Verify "Offer to Help" CTA button is visible on mobile
    const helpButton = page.getByRole("button", { name: /offer to help/i });
    await expect(helpButton).toBeVisible();
  });

  test("User can navigate through organization sections on mobile", async ({
    page,
  }) => {
    const organizationPage = newOrganizationPage(page);

    // Navigate to About section using existing component object
    await organizationPage.menu.aboutOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/about/);
    await expect(organizationPage.aboutPage.getInvolvedCard).toBeVisible();

    // Navigate back to mobile menu (if auto-redirect doesn't happen)
    await page.goBack();

    // Navigate to Events section
    await organizationPage.menu.eventsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/events/);

    // Navigate back to mobile menu
    await page.goBack();

    // Navigate to Resources section
    await organizationPage.menu.resourcesOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/resources/);

    // Navigate back to mobile menu
    await page.goBack();

    // Navigate to FAQ section
    await organizationPage.menu.questionsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/faq/);
  });

  test("Mobile navigation preserves organization context", async ({ page }) => {
    const organizationPage = newOrganizationPage(page);

    // Get organization name from mobile view
    const orgName = await organizationPage.heading.textContent();

    // Navigate to different sections and verify org name consistency using existing component object
    await organizationPage.menu.aboutOption.click();
    await expect(
      page.getByRole("heading", { name: new RegExp(orgName!, "i") })
    ).toBeVisible();

    await page.goBack();
    await organizationPage.menu.eventsOption.click();
    await expect(page.getByText(new RegExp(orgName!, "i"))).toBeVisible();
  });
});
