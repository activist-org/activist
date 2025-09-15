// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import enUS from "~/i18n/en-US.json";
import { newOrganizationsHomePage } from "~/test-e2e/page-objects/OrganizationsHomePage";

test.beforeEach(async ({ page }) => {
  await page.goto("/organizations");
  const organizationsHomePage = newOrganizationsHomePage(page);
  await expect(organizationsHomePage.heading).toHaveText(/organizations/i);
});

test.describe("Organizations Home Page", { tag: "@desktop" }, () => {
  test("User can share the organization page", async ({ page }) => {
    const organizationsHomePage = newOrganizationsHomePage(page);

    await organizationsHomePage.shareButton.click();
    await expect(
      organizationsHomePage.tooltip(organizationsHomePage.shareButton)
    ).toBeVisible();
    await organizationsHomePage
      .tooltipButton(organizationsHomePage.shareButton)
      .click();

    await expect(organizationsHomePage.shareModal).toBeVisible();

    // Close the modal by clicking the close button
    const closeModalButton = organizationsHomePage.closeModalButton(
      organizationsHomePage.shareModal
    );
    await expect(closeModalButton).toBeVisible();
    await closeModalButton.click({ force: true });

    // Expect the modal to not be visible
    await expect(organizationsHomePage.shareModal).not.toBeVisible();
  });

  test("Combobox opens and shows dropdown options", async ({ page }) => {
    const organizationsHomePage = newOrganizationsHomePage(page);

    // Click on the combobox to open dropdown
    await organizationsHomePage.comboboxButton.click();

    // Verify the dropdown options are visible
    const dropdownOptions = page.locator('[role="listbox"]');
    await expect(dropdownOptions).toBeVisible();

    // Verify "All topics" option is present
    const allTopicsOption = page.getByRole("option", { name: /all topics/i });
    await expect(allTopicsOption).toBeVisible();
  });

  test("Combobox displays all expected topic options", async ({ page }) => {
    const organizationsHomePage = newOrganizationsHomePage(page);

    // Open the combobox dropdown
    await organizationsHomePage.comboboxButton.click();

    // Verify all topic options are present (read from i18n file)
    const topicKeys = Object.keys(enUS).filter((key) => {
      const parts = key.split(".");
      return (
        parts.length === 5 &&
        parts[0] === "i18n" &&
        parts[1] === "types" &&
        parts[2] === "content" &&
        parts[3] === "topics" &&
        parts[4] !== ""
      );
    });

    const expectedTopics = topicKeys.map(
      (key) => enUS[key as keyof typeof enUS]
    );

    for (const topic of expectedTopics) {
      const topicOption = page.getByRole("option", { name: topic });
      await expect(topicOption).toBeVisible();
    }
  });

  test("Combobox option selection closes dropdown", async ({ page }) => {
    const organizationsHomePage = newOrganizationsHomePage(page);

    // Open the combobox dropdown
    await organizationsHomePage.comboboxButton.click();
    const dropdownOptions = page.locator('[role="listbox"]');
    await expect(dropdownOptions).toBeVisible();

    // Click on "All topics" option
    const allTopicsOption = page.getByRole("option", { name: /all topics/i });
    await allTopicsOption.click();

    // Verify the dropdown closes after selection
    await expect(dropdownOptions).not.toBeVisible();
  });

  test("Combobox filtering works correctly", async ({ page }) => {
    const organizationsHomePage = newOrganizationsHomePage(page);

    // Open combobox and type to filter
    await organizationsHomePage.comboboxButton.click();
    await organizationsHomePage.comboboxButton.fill("environment");

    // Verify filtered options appear
    const dropdownOptions = page.locator('[role="listbox"]');
    await expect(dropdownOptions).toBeVisible();
    const environmentOption = page.getByRole("option", { name: "Environment" });
    await expect(environmentOption).toBeVisible();

    // Clear the filter to show all options again
    await organizationsHomePage.comboboxButton.clear();
    const allTopicsOption = page.getByRole("option", { name: /all topics/i });
    await expect(allTopicsOption).toBeVisible();
  });
});
