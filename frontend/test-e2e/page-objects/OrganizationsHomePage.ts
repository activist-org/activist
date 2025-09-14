// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

export const newOrganizationsHomePage = (page: Page) => ({
  heading: page.getByRole("heading", { level: 1 }),
  organizationLink: page
    .getByRole("link", {
      name: /Navigate to the page for this organization/i,
    })
    .first(),
  // Add more locators specific to organizations home/listing page
  // e.g., organization cards, filters, search, pagination, etc.
});
