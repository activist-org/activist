import { test, expect } from "@playwright/test";

import { MEMBER_AUTH_STATE_PATH } from "~/test-e2e/constants/authPaths";

import { newOrganizationResourcesPage } from "../../../../page-objects/organization/resources/OrganizationResourcesPage";
import {
  MOCK_ORG_ID,
  mockOrganizationDetailPayload,
  routeMockPublicOrganizationDetail,
} from "../../../../utils/mock-public-organization-detail";

test.describe("Organization Resources Empty States @desktop @mobile", () => {
  test.afterEach(async ({ page }) => {
    await page.unrouteAll();
  });

  test.describe("Admin / Editor variant", () => {
    test("sees empty state with add/create affordances", async ({ page }) => {
      const payload = mockOrganizationDetailPayload(MOCK_ORG_ID, { resources: [] });
      await routeMockPublicOrganizationDetail(page, MOCK_ORG_ID, payload);
      
      await page.goto(`/en/organizations/${MOCK_ORG_ID}/resources`);
      
      const resourcesPage = newOrganizationResourcesPage(page);
      await expect(resourcesPage.emptyState).toBeVisible();
      await expect(resourcesPage.emptyState.getByRole("button")).toBeVisible();
    });
  });

  test.describe("Non-editor / Viewer variant", () => {
    test.use({ storageState: MEMBER_AUTH_STATE_PATH });
    
    test("sees read-only empty state without misleading CTAs", async ({ page }) => {
      const payload = mockOrganizationDetailPayload(MOCK_ORG_ID, { resources: [] });
      await routeMockPublicOrganizationDetail(page, MOCK_ORG_ID, payload);
      
      await page.goto(`/en/organizations/${MOCK_ORG_ID}/resources`);
      
      const resourcesPage = newOrganizationResourcesPage(page);
      await expect(resourcesPage.emptyState).toBeVisible();
      await expect(resourcesPage.emptyState.getByRole("button")).toBeHidden();
    });
  });
});