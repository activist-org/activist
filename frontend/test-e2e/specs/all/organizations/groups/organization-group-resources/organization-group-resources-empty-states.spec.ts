// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Group resources lists come from `useGetGroup` (embedded `resources`), not a separate list URL.
 * Mock GET `/api/public/communities/groups/:id` before navigation (client-only fetch; see nuxt `ssr: false`).
 */
import { getEnglishText } from "#shared/utils/i18n";
import { MEMBER_AUTH_STATE_PATH } from "~/test-e2e/constants/authPaths";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import {
  MOCK_GROUP_EMPTY_STATE_ID,
  MOCK_GROUP_EMPTY_STATE_ORG_ID,
  mockGroupDetailPayload,
  routeMockPublicGroupDetail,
  sampleResourceForMock,
} from "~/test-e2e/utils/mock-public-group-detail";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

test.describe(
  "Admin sees editable empty state on organization group resources page",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    // MARK: Empty State

    test("Shows empty state with editable copy when group has no resources", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { groupResourcesPage } = newOrganizationPage(page);

      await routeMockPublicGroupDetail(
        page,
        MOCK_GROUP_EMPTY_STATE_ID,
        mockGroupDetailPayload(MOCK_GROUP_EMPTY_STATE_ID, { resources: [] })
      );
      await page.goto(
        `/organizations/${MOCK_GROUP_EMPTY_STATE_ORG_ID}/groups/${MOCK_GROUP_EMPTY_STATE_ID}/resources`
      );

      await expect(groupResourcesPage.emptyState).toBeVisible({
        timeout: 15000,
      });
      await expect(groupResourcesPage.resourcesList).not.toBeVisible();
      await expect(
        page.getByRole("heading", {
          name: new RegExp(
            getEnglishText("i18n.components.empty_state.resources_header"),
            "i"
          ),
        })
      ).toBeVisible();
      await expect(
        page.getByRole("heading", {
          level: 4,
          name: new RegExp(
            getEnglishText(
              "i18n.components.empty_state.message_with_permission"
            ),
            "i"
          ),
        })
      ).toBeVisible();
      await expect(
        page.getByRole("link", {
          name: new RegExp(
            getEnglishText(
              "i18n.components.empty_state.create_resource_aria_label"
            ),
            "i"
          ),
        })
      ).toBeVisible();
      await expect(groupResourcesPage.newResourceButton).toBeVisible();
    });

    // MARK: Not Empty

    test("Does not show empty state when group has resources", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { groupResourcesPage } = newOrganizationPage(page);

      await routeMockPublicGroupDetail(
        page,
        MOCK_GROUP_EMPTY_STATE_ID,
        mockGroupDetailPayload(MOCK_GROUP_EMPTY_STATE_ID, {
          resources: [sampleResourceForMock],
        })
      );
      await page.goto(
        `/organizations/${MOCK_GROUP_EMPTY_STATE_ORG_ID}/groups/${MOCK_GROUP_EMPTY_STATE_ID}/resources`
      );

      await expect(groupResourcesPage.resourcesList).toBeVisible({
        timeout: 15000,
      });
      await expect(groupResourcesPage.resourceCards).toHaveCount(1);
      await expect(groupResourcesPage.emptyState).not.toBeVisible();
    });
  }
);

test.describe(
  "Non-admin member sees read-only empty state on organization group resources page",
  { tag: ["@desktop", "@mobile", "@member"] },
  () => {
    test.use({ storageState: MEMBER_AUTH_STATE_PATH });

    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    // MARK: Empty State

    test("Shows read-only empty state when group has no resources", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { groupResourcesPage } = newOrganizationPage(page);

      await routeMockPublicGroupDetail(
        page,
        MOCK_GROUP_EMPTY_STATE_ID,
        mockGroupDetailPayload(MOCK_GROUP_EMPTY_STATE_ID, { resources: [] })
      );
      await page.goto(
        `/organizations/${MOCK_GROUP_EMPTY_STATE_ORG_ID}/groups/${MOCK_GROUP_EMPTY_STATE_ID}/resources`
      );

      await expect(groupResourcesPage.emptyState).toBeVisible({
        timeout: 15000,
      });
      await expect(
        page.getByRole("heading", {
          level: 4,
          name: new RegExp(
            getEnglishText("i18n.components.empty_state.message_no_permission"),
            "i"
          ),
        })
      ).toBeVisible();
      await expect(
        page.getByRole("link", {
          name: new RegExp(
            getEnglishText(
              "i18n.components.empty_state.create_resource_aria_label"
            ),
            "i"
          ),
        })
      ).not.toBeVisible();
      await expect(groupResourcesPage.newResourceButton).not.toBeVisible();
    });
  }
);
