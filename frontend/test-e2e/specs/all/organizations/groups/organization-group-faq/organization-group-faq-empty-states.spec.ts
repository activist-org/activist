// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Group FAQ lists come from `useGetGroup` (embedded `faqEntries`), not a separate list URL.
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
  sampleFaqEntryForMock,
} from "~/test-e2e/utils/mock-public-group-detail";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

test.describe(
  "Admin sees editable empty state on organization group FAQ page",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    // MARK: Empty State

    test("Shows empty state with editable copy when group has no FAQ entries", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { groupFaqPage } = newOrganizationPage(page);

      await routeMockPublicGroupDetail(
        page,
        MOCK_GROUP_EMPTY_STATE_ID,
        mockGroupDetailPayload(MOCK_GROUP_EMPTY_STATE_ID, { faqEntries: [] })
      );
      await page.goto(
        `/organizations/${MOCK_GROUP_EMPTY_STATE_ORG_ID}/groups/${MOCK_GROUP_EMPTY_STATE_ID}/faq`
      );

      await expect(groupFaqPage.emptyState).toBeVisible({ timeout: 15000 });
      await expect(groupFaqPage.faqList).not.toBeVisible();
      await expect(
        page.getByRole("heading", {
          name: new RegExp(
            getEnglishText("i18n.components.empty_state.faq_header"),
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
      await expect(groupFaqPage.newFaqButton).toBeVisible();
    });

    // MARK: Not Empty

    test("Does not show empty state when group has FAQ entries", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { groupFaqPage } = newOrganizationPage(page);

      await routeMockPublicGroupDetail(
        page,
        MOCK_GROUP_EMPTY_STATE_ID,
        mockGroupDetailPayload(MOCK_GROUP_EMPTY_STATE_ID, {
          faqEntries: [sampleFaqEntryForMock],
        })
      );
      await page.goto(
        `/organizations/${MOCK_GROUP_EMPTY_STATE_ORG_ID}/groups/${MOCK_GROUP_EMPTY_STATE_ID}/faq`
      );

      await expect(groupFaqPage.faqList).toBeVisible({ timeout: 15000 });
      await expect(groupFaqPage.faqCards).toHaveCount(1);
      await expect(groupFaqPage.emptyState).not.toBeVisible();
    });
  }
);

test.describe(
  "Non-admin member sees read-only empty state on organization group FAQ page",
  { tag: ["@desktop", "@mobile", "@member"] },
  () => {
    test.use({ storageState: MEMBER_AUTH_STATE_PATH });

    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    // MARK: Empty State

    test("Shows read-only empty state when group has no FAQ entries", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const { groupFaqPage } = newOrganizationPage(page);

      await routeMockPublicGroupDetail(
        page,
        MOCK_GROUP_EMPTY_STATE_ID,
        mockGroupDetailPayload(MOCK_GROUP_EMPTY_STATE_ID, { faqEntries: [] })
      );
      await page.goto(
        `/organizations/${MOCK_GROUP_EMPTY_STATE_ORG_ID}/groups/${MOCK_GROUP_EMPTY_STATE_ID}/faq`
      );

      await expect(groupFaqPage.emptyState).toBeVisible({ timeout: 15000 });
      await expect(
        page.getByRole("heading", {
          level: 4,
          name: new RegExp(
            getEnglishText("i18n.components.empty_state.message_no_permission"),
            "i"
          ),
        })
      ).toBeVisible();
      await expect(groupFaqPage.newFaqButton).not.toBeVisible();
    });
  }
);
