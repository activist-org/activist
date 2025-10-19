// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "playwright";

import { expect, test } from "playwright/test";

import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { newOrganizationsHomePage } from "~/test-e2e/page-objects/OrganizationsHomePage";
import { getEnglishText } from "~/utils/i18n";

/**
 * Navigate to the first organization page from the organizations list
 * @param page - Playwright page object
 * @returns Object containing the organizationId and organizationPage object
 */
export async function navigateToFirstOrganization(page: Page) {
  // Navigate to organizations home page.
  await page.goto("/organizations", { waitUntil: "domcontentloaded" });

  const organizationsHomePage = newOrganizationsHomePage(page);

  // Wait for the heading to be visible before checking text.
  await expect(organizationsHomePage.heading).toBeVisible();
  await expect(organizationsHomePage.heading).toHaveText(
    getEnglishText("i18n.pages.organizations.index.header_title")
  );

  // Wait for at least one organization card to load (data from API).
  // This is the key wait - ensures backend API has returned organizations.
  await expect(page.getByTestId("organization-card").first()).toBeVisible({
    timeout: 30000, // increased for slow remote servers
  });

  // Wait for organization link to be available (should be quick after card is visible).
  await expect(organizationsHomePage.organizationLink).toBeVisible({
    timeout: 10000,
  });

  // Get the href attribute to extract the organization UUID.
  const href =
    await organizationsHomePage.organizationLink.getAttribute("href");
  const organizationId = href?.match(/\/organizations\/([a-f0-9-]{36})/)?.[1];

  if (!organizationId) {
    throw new Error(`Could not extract organization ID from href: ${href}`);
  }

  // Click on the first organization to navigate to its page.
  await organizationsHomePage.organizationLink.click();
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
  // Map subpage names to menu option names.
  const subpageMapping: Record<string, string> = {
    faq: "questions",
    // Add other mappings as needed.
  };

  const menuSubpage = subpageMapping[subpage] || subpage;

  // Skip authentication since tests are already authenticated via global storageState.
  const { organizationId, organizationPage } =
    await navigateToFirstOrganization(page);

  // Detect if mobile layout is active by checking viewport width.
  const viewportSize = page.viewportSize();
  const isMobileLayout = viewportSize ? viewportSize.width < 768 : false;
  const submenu = page.locator("#submenu");

  if (isMobileLayout) {
    // Mobile layout: requires opening dropdown menu first.
    await submenu.waitFor({ timeout: 10000 });

    const listboxButton = submenu.getByRole("button");
    await listboxButton.waitFor({ state: "attached", timeout: 10000 });

    // Check if the dropdown is already open before clicking.
    const isAlreadyOpen =
      (await listboxButton.getAttribute("aria-expanded")) === "true";
    if (!isAlreadyOpen) {
      await listboxButton.click();
      await page.getByRole("listbox").waitFor({ timeout: 10000 });
    }

    // Wait for the page to be fully loaded and menu entries to be initialized.
    await page.waitForLoadState("domcontentloaded");

    // Wait for the organization page heading to be visible (ensures page is loaded).
    await expect(organizationPage.pageHeading).toBeVisible();

    // Wait for the dropdown options to be rendered.
    await page.getByRole("listbox").waitFor({ timeout: 10000 });

    // Use original subpage name for i18n lookup, not the mapped menuSubpage.
    const i18nKeyMap: Record<string, string> = {
      resources: "i18n._global.resources",
      events: "i18n._global.events",
      faq: "i18n._global.faq",
      groups: "i18n.composables.use_menu_entries_state.groups",
      affiliates: "i18n.composables.use_menu_entries_state.affiliates",
      tasks: "i18n.composables.use_menu_entries_state.tasks",
      discussions: "i18n._global.discussions",
      settings: "i18n._global.settings",
    };

    const i18nKey =
      i18nKeyMap[subpage] ||
      `i18n.composables.use_menu_entries_state.${subpage}`;

    const subpageOption = page.getByRole("option", {
      name: new RegExp(getEnglishText(i18nKey), "i"),
    });

    await subpageOption.click();
  } else {
    // Desktop layout: uses direct tab navigation.
    // Wait for the page to be fully loaded and menu entries to be initialized.
    await page.waitForLoadState("domcontentloaded");
    await expect(organizationPage.pageHeading).toBeVisible();

    // Wait for the specific menu option to be visible and clickable.
    const subpageOption =
      organizationPage.menu[
        `${menuSubpage}Option` as keyof typeof organizationPage.menu
      ];

    await expect(subpageOption).toBeVisible();
    await subpageOption.waitFor({ state: "attached" });

    // Wait intelligently for menu entries to be created with correct route parameters.
    await expect(async () => {
      const href = await subpageOption.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).toContain(`/${subpage}`);
    }).toPass({ timeout: 2000, intervals: [50, 100, 250] });

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
  // First navigate to the first organization.
  const { organizationId, organizationPage } =
    await navigateToFirstOrganization(page);

  // Navigate to the Events tab.
  await organizationPage.menu.eventsOption.click();
  await expect(page).toHaveURL(/.*\/organizations\/.*\/events/);

  // Check if there are any events available.
  const { eventsPage } = organizationPage;
  const eventCount = await eventsPage.getEventCount();

  if (eventCount === 0) {
    throw new Error("No events available to navigate to");
  }

  // Get the first event's URL before navigating.
  const firstEventLink = eventsPage.getEventLink(0);
  const eventUrl = await firstEventLink.getAttribute("href");

  if (!eventUrl) {
    throw new Error("Could not get event URL");
  }

  // Extract event ID from the URL (assuming format like /events/{uuid}).
  const eventId = eventUrl.match(/\/events\/([a-f0-9-]{36})/)?.[1];

  if (!eventId) {
    throw new Error("Could not extract event ID from URL");
  }

  // Navigate to the first event.
  await eventsPage.navigateToEvent(0);
  await page.waitForURL(`**/events/${eventId}/**`);

  // Verify we're on the event page.
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  return {
    organizationId,
    eventId,
    organizationPage,
    eventsPage,
  };
}

/**
 * Navigate to a group subpage within an organization
 * @param page - Playwright page object
 * @param subpage - The group subpage to navigate to (e.g., 'about', 'events', 'faq', 'resources')
 * @returns Object containing organizationId, groupId, and organizationPage
 */
export async function navigateToOrganizationGroupSubpage(
  page: Page,
  subpage: string
) {
  // Check if we're already on the correct page to avoid unnecessary navigation.
  const currentUrl = page.url();
  if (
    currentUrl.includes(`/organizations/`) &&
    currentUrl.includes(`/groups/`) &&
    currentUrl.includes(`/${subpage}`)
  ) {
    return { organizationId: "", organizationPage: newOrganizationPage(page) };
  }

  // First navigate to the first organization and then the groups tab.
  const { organizationId, organizationPage } =
    await navigateToFirstOrganization(page);

  // Check if we're on mobile or desktop by checking viewport width.
  const viewportSize = page.viewportSize();
  const isMobileLayout = viewportSize ? viewportSize.width < 768 : false;

  if (isMobileLayout) {
    // Mobile layout: requires opening dropdown menu first.
    // Use getByRole to find the ListboxButton within the submenu context.
    // Since the ListboxButton is inside the #submenu container, we can be more specific.
    const submenu = page.locator("#submenu"); // We still need this for context since it's conditionally rendered
    await submenu.waitFor({ timeout: 10000 });

    const listboxButton = submenu.getByRole("button");
    await listboxButton.waitFor({ state: "attached", timeout: 10000 });

    // Check if the dropdown is already open before clicking.
    const isAlreadyOpen =
      (await listboxButton.getAttribute("aria-expanded")) === "true";
    if (!isAlreadyOpen) {
      await listboxButton.click();
      // Wait for the dropdown to actually open using getByRole.
      await page.getByRole("listbox").waitFor({ timeout: 10000 });
    }

    // Wait for the page to be fully loaded and menu entries to be initialized.
    await page.waitForLoadState("domcontentloaded");
    await expect(organizationPage.pageHeading).toBeVisible();

    // Wait for the dropdown options to be rendered - they appear in a transition.
    // The dropdown options are in ListboxOptions which appear after clicking the button.
    await page.getByRole("listbox").waitFor({ timeout: 10000 });

    // Wait for the groups option to be visible and clickable.
    await expect(organizationPage.menu.groupsOption).toBeVisible();
    await page.waitForLoadState("domcontentloaded");

    // Click on the ListboxOption (role="option") which contains the NuxtLink.
    const groupsOption = page.getByRole("option", {
      name: new RegExp(
        getEnglishText("i18n.composables.use_menu_entries_state.groups"),
        "i"
      ),
    });

    // Click the option - the NuxtLink's @click handler will navigate using the updated routeUrl.
    await groupsOption.click();
  } else {
    // Desktop layout: direct click
    await expect(organizationPage.menu.groupsOption).toBeVisible();
    await organizationPage.menu.groupsOption.click();
  }

  await page.waitForLoadState("domcontentloaded");
  await expect(page).toHaveURL(/\/organizations\/[a-f0-9-]{36}\/groups/);

  // Check if there are any groups available.
  const { groupsPage } = organizationPage;

  // Wait for groups to load completely.
  await page.waitForLoadState("domcontentloaded");

  // Wait for either groups or empty state to appear (same approach as working test).
  try {
    await expect(async () => {
      const groupsListVisible = await groupsPage.groupsList
        .isVisible()
        .catch(() => false);
      const emptyStateVisible = await groupsPage.emptyState
        .isVisible()
        .catch(() => false);
      expect(groupsListVisible || emptyStateVisible).toBe(true);
    }).toPass({ timeout: 15000 });
  } catch {
    // Fallback: just wait for the page to load and continue.
    // Groups list/empty state not found, continuing with fallback approach.
  }

  // Additional wait to ensure page is fully loaded.
  await page.waitForLoadState("domcontentloaded");

  const groupCount = await groupsPage.getGroupCount();

  if (groupCount === 0) {
    // Skip the test if no groups are available.
    test.skip(
      true,
      "No groups available to navigate to - skipping group subpage tests"
    );
    return {
      organizationId,
      groupId: null,
      organizationPage,
      groupsPage,
    };
  }

  // Get the first group's URL before navigating.
  const firstGroupLink = groupsPage.getGroupLink(0);
  const groupUrl = await firstGroupLink.getAttribute("href");

  if (!groupUrl) {
    throw new Error("Could not get group URL");
  }

  // Extract group ID from the URL (assuming format like /groups/{uuid}).
  const groupId = groupUrl.match(/\/groups\/([a-f0-9-]{36})/)?.[1];

  if (!groupId) {
    throw new Error("Could not extract group ID from URL");
  }

  // Navigate to the first group and wait for the navigation to be successful.
  await groupsPage.navigateToGroup(0);
  await page.waitForURL(`**/groups/${groupId}/**`, { timeout: 10000 });
  await page.waitForLoadState("domcontentloaded");

  // Now navigate to the specific subpage using the tab navigation.
  // The subpage should be accessible via the tab list.
  const tabList = page.getByRole("tablist");
  await expect(tabList).toBeVisible({ timeout: 15000 });

  // Find the specific tab for the subpage by its content.
  const subpageTab = page.getByRole("tab", { name: subpage });
  await expect(subpageTab).toBeVisible({ timeout: 15000 });

  // Click the tab to navigate to the subpage.
  await subpageTab.click({ timeout: 15000 });

  // Wait for navigation to complete.
  await page.waitForLoadState("domcontentloaded");
  await page.waitForURL(`**/groups/${groupId}/${subpage}`, { timeout: 10000 });

  // Verify we're on the correct group subpage.
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  return {
    organizationId,
    groupId,
    organizationPage,
    groupsPage,
  };
}
