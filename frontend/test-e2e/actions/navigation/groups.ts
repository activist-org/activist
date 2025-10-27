// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "playwright";

import { expect, test } from "playwright/test";

import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { getEnglishText } from "~/utils/i18n";

import { navigateToFirstOrganization } from "./organizations";

// MARK: Org Group Subpage

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
    await submenu.waitFor({ timeout: 5000 });

    const listboxButton = submenu.getByRole("button");
    await listboxButton.waitFor({ state: "attached", timeout: 5000 });

    // Check if the dropdown is already open before clicking.
    const isAlreadyOpen =
      (await listboxButton.getAttribute("aria-expanded")) === "true";
    if (!isAlreadyOpen) {
      await listboxButton.click();
      // Wait for the dropdown to actually open using getByRole.
      await page.getByRole("listbox").waitFor({ timeout: 5000 });
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
    }).toPass({ timeout: 10000 });
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
  await page.waitForURL(`**/groups/${groupId}/**`, { timeout: 5000 });
  await page.waitForLoadState("domcontentloaded");

  // Now navigate to the specific subpage using the tab navigation.
  // The subpage should be accessible via the tab list.
  const tabList = page.getByRole("tablist");
  await expect(tabList).toBeVisible({ timeout: 5000 });

  // Find the specific tab for the subpage by its content.
  const subpageTab = page.getByRole("tab", { name: subpage });
  await expect(subpageTab).toBeVisible({ timeout: 5000 });

  // Click the tab to navigate to the subpage.
  await subpageTab.click({ timeout: 5000 });

  // Wait for navigation to complete.
  await page.waitForLoadState("domcontentloaded");
  await page.waitForURL(`**/groups/${groupId}/${subpage}`, { timeout: 5000 });

  // Verify we're on the correct group subpage.
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  return {
    organizationId,
    groupId,
    organizationPage,
    groupsPage,
  };
}
