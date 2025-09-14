// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { newOrganizationsHomePage } from "~/test-e2e/page-objects/OrganizationsHomePage";

test.beforeEach(async ({ page }) => {
  await page.goto("/organizations");
  const organizationsHomePage = newOrganizationsHomePage(page);
  await expect(organizationsHomePage.heading).toHaveText(/organizations/i);
});

test.describe("Organizations Home Page", { tag: "@desktop" }, () => {
  // Add tests specific to the organizations home/listing page here
  // e.g., filtering, searching, pagination, etc.
});
