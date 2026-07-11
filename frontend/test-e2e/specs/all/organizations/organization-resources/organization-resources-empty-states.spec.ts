// SPDX-License-Identifier: AGPL-3.0-or-later

import { getEnglishText } from "#shared/utils/i18n";
import { MEMBER_AUTH_STATE_PATH } from "~/test-e2e/constants/authPaths";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationResourcesPage } from "~/test-e2e/page-objects/organization/resources/OrganizationResourcesPage";
import {
  MOCK_ORGANIZATION_EMPTY_STATE_ID,
  mockOrganizationDetailPayload,
  routeMockPublicOrganizationDetail,
  sampleResourceForMock,
} from "~/test-e2e/utils/mock-public-organization-detail";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

test.describe("Organization Resources Empty States", { tag: ["@desktop", "@mobile"] }, () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(async ({}, testInfo) => {
    logTestPath(testInfo);
  });

  test("Admin sees the empty state with the create button when no resources exist", async ({ page }) => {
    const resourcesPage = newOrganizationResourcesPage(page);

    await routeMockPublicOrganizationDetail(
      page,
      MOCK_ORGANIZATION_EMPTY_STATE_ID,
      mockOrganizationDetailPayload(MOCK_ORGANIZATION_EMPTY_STATE_ID, {
        resources: [],
      }),
    );

    await page.goto(`/organizations/${MOCK_ORGANIZATION_EMPTY_STATE_ID}/resources`);

    await expect(page.getByText(getEnglishText("i18n.components.empty_state.message_with_permission"))).toBeVisible();
    await expect(resourcesPage.newResourceButton).toBeVisible();
    await expect(page.getByRole("list")).toBeHidden();
  });

  test("Viewer sees the empty state without the create button", { tag: ["@member"] }, async ({ browser }) => {
    const context = await browser.newContext({ storageState: MEMBER_AUTH_STATE_PATH });
    const page = await context.newPage();
    const resourcesPage = newOrganizationResourcesPage(page);

    await routeMockPublicOrganizationDetail(
      page,
      MOCK_ORGANIZATION_EMPTY_STATE_ID,
      mockOrganizationDetailPayload(MOCK_ORGANIZATION_EMPTY_STATE_ID, {
        resources: [],
      }),
    );

    await page.goto(`/organizations/${MOCK_ORGANIZATION_EMPTY_STATE_ID}/resources`);

    await expect(page.getByText(getEnglishText("i18n.components.empty_state.message_no_permission"))).toBeVisible();
    await expect(resourcesPage.newResourceButton).toBeHidden();
    await expect(page.getByRole("list")).toBeHidden();

    await context.close();
  });

  test("List is shown and empty state is hidden when resources exist", async ({ page }) => {
    await routeMockPublicOrganizationDetail(
      page,
      MOCK_ORGANIZATION_EMPTY_STATE_ID,
      mockOrganizationDetailPayload(MOCK_ORGANIZATION_EMPTY_STATE_ID, {
        resources: [sampleResourceForMock()],
      }),
    );

    await page.goto(`/organizations/${MOCK_ORGANIZATION_EMPTY_STATE_ID}/resources`);

    await expect(page.getByText(getEnglishText("i18n.components.empty_state.message_with_permission"))).toBeHidden();
    await expect(page.getByText(getEnglishText("i18n.components.empty_state.message_no_permission"))).toBeHidden();
    await expect(page.getByRole("list")).toBeVisible();
  });
});