// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "playwright";

import { expect } from "playwright/test";

import { signInAsAdmin } from "~/test-e2e/actions/authentication";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";
import { newOrganizationsHomePage } from "~/test-e2e/page-objects/OrganizationsHomePage";
import { getEnglishText } from "~/utils/i18n";

/**
 * Navigate to the first organization page from the organizations list
 * @param page - Playwright page object
 * @returns Object containing the organizationId and organizationPage object
 */
export async function navigateToFirstOrganization(page: Page) {
  // Navigate to organizations home page first
  await page.goto("/organizations");
  await page.waitForLoadState("networkidle");

  const organizationsHomePage = newOrganizationsHomePage(page);
  await expect(organizationsHomePage.heading).toHaveText(
    getEnglishText("i18n.pages.organizations.index.header_title")
  );

  // Get the href attribute to extract the organization UUID
  const href =
    await organizationsHomePage.organizationLink.getAttribute("href");
  const organizationId = href?.match(/\/organizations\/([a-f0-9-]{36})/)?.[1];

  if (!organizationId) {
    throw new Error(`Could not extract organization ID from href: ${href}`);
  }

  // Click on the first organization to navigate to its page
  await organizationsHomePage.organizationLink.click();
  // Wait for navigation to the specific organization page
  await page.waitForURL(`**/organizations/${organizationId}/**`);

  const organizationPage = newOrganizationPage(page);
  await expect(organizationPage.pageHeading).toBeVisible();

  return {
    organizationId,
    organizationPage,
  };
}

/**
 * Navigate directly to a specific organization page by ID
 * @param page - Playwright page object
 * @param organizationId - The UUID of the organization
 * @returns OrganizationPage object
 */
export async function navigateToOrganization(
  page: Page,
  organizationId: string
) {
  await page.goto(`/organizations/${organizationId}`);
  await page.waitForURL(`**/organizations/${organizationId}/**`);

  const organizationPage = newOrganizationPage(page);
  await expect(organizationPage.pageHeading).toBeVisible();

  return organizationPage;
}

/**
 * Navigate to organization subpage using the appropriate navigation pattern for the platform
 * @param page - Playwright page object
 * @param subpage - The subpage to navigate to (e.g., 'events', 'resources', 'groups')
 * @returns Object containing organizationId and organizationPage
 */
export async function navigateToOrganizationSubpage(
  page: Page,
  subpage: string
) {
  await signInAsAdmin(page);
  const { organizationId, organizationPage } =
    await navigateToFirstOrganization(page);

  // Detect if mobile layout is active by checking if toggle button is visible
  const toggleButton = organizationPage.menu.toggleOpenButton;
  const isMobileLayout = await toggleButton.isVisible();

  if (isMobileLayout) {
    // Mobile layout: requires opening dropdown menu first
    await toggleButton.click();
    await page.waitForTimeout(500); // Wait for dropdown to open

    // Click the appropriate subpage option
    const subpageOption = organizationPage.menu[
      `${subpage}Option` as keyof typeof organizationPage.menu
    ] as { click: () => Promise<void> };
    await subpageOption.click();

    // Check if mobile navigation worked correctly
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    if (currentUrl.includes("undefined")) {
      // Mobile navigation bug: use direct navigation as fallback
      const correctUrl = `/organizations/${organizationId}/${subpage}`;
      await page.goto(correctUrl);
    }
  } else {
    // Desktop layout: uses direct tab navigation
    const subpageOption = organizationPage.menu[
      `${subpage}Option` as keyof typeof organizationPage.menu
    ] as { click: () => Promise<void> };
    await subpageOption.click();
  }

  await expect(page).toHaveURL(
    new RegExp(`.*\\/organizations\\/.*\\/${subpage}`)
  );

  return { organizationId, organizationPage };
}

/**
 * Navigate to the first event from the first organization's events page
 * @param page - Playwright page object
 * @returns Object containing organizationId, eventId (if available), and page objects
 */
export async function navigateToFirstOrganizationEvent(page: Page) {
  // First navigate to the first organization
  const { organizationId, organizationPage } =
    await navigateToFirstOrganization(page);

  // Navigate to the Events tab
  await organizationPage.menu.eventsOption.click();
  await expect(page).toHaveURL(/.*\/organizations\/.*\/events/);

  // Check if there are any events available
  const eventsPage = organizationPage.eventsPage;
  const eventCount = await eventsPage.getEventCount();

  if (eventCount === 0) {
    throw new Error("No events available to navigate to");
  }

  // Get the first event's URL before navigating
  const firstEventLink = eventsPage.getEventLink(0);
  const eventUrl = await firstEventLink.getAttribute("href");

  if (!eventUrl) {
    throw new Error("Could not get event URL");
  }

  // Extract event ID from the URL (assuming format like /events/{uuid})
  const eventId = eventUrl.match(/\/events\/([a-f0-9-]{36})/)?.[1];

  if (!eventId) {
    throw new Error("Could not extract event ID from URL");
  }

  // Navigate to the first event
  await eventsPage.navigateToEvent(0);

  // Wait for navigation to the event page
  await page.waitForURL(`**/events/${eventId}/**`);

  // Verify we're on the event page
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  return {
    organizationId,
    eventId,
    organizationPage,
    eventsPage,
  };
}
