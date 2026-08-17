// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Organization FAQ lists come from `useGetOrganization` (embedded `faqEntries`), not a separate list URL.
 * Mock GET `/api/public/communities/organizations/:id` before navigation (client-only fetch; see nuxt `ssr: false`).
 */
import { getEnglishText } from "#shared/utils/i18n";
import { MEMBER_AUTH_STATE_PATH } from "~/test-e2e/constants/authPaths";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import {
  MOCK_ORGANIZATION_EMPTY_STATE_ID,
  mockOrganizationDetailPayload,
  routeMockPublicOrganizationDetail,
  sampleOrganizationFaqEntryForMock,
} from "~/test-e2e/utils/mock-public-organization-detail";
import { logTestPath } from "~/test-e2e/utils/test-traceability";

test.describe(
  "Admin sees editable empty state on organization FAQ page",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    test("Shows empty state with editable copy when organization has no FAQ entries", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      await routeMockPublicOrganizationDetail(
        page,
        MOCK_ORGANIZATION_EMPTY_STATE_ID,
        mockOrganizationDetailPayload(MOCK_ORGANIZATION_EMPTY_STATE_ID, { faqEntries: [] })
      );
      await page.goto(`/organizations/${MOCK_ORGANIZATION_EMPTY_STATE_ID}/faq`);

      const { faqPage } = newOrganizationPage(page);
      await expect(faqPage.emptyState).toBeVisible({ timeout: 15000 });
      await expect(faqPage.faqList).not.toBeVisible();
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
      await expect(faqPage.newFAQButton).toBeVisible();
    });

    test("Does not show empty state when organization has FAQ entries", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      await routeMockPublicOrganizationDetail(
        page,
        MOCK_ORGANIZATION_EMPTY_STATE_ID,
        mockOrganizationDetailPayload(MOCK_ORGANIZATION_EMPTY_STATE_ID, {
          faqEntries: [sampleOrganizationFaqEntryForMock],
        })
      );
      await page.goto(`/organizations/${MOCK_ORGANIZATION_EMPTY_STATE_ID}/faq`);

      const { faqPage } = newOrganizationPage(page);
      await expect(faqPage.faqList).toBeVisible({ timeout: 15000 });
      await expect(faqPage.faqCards).toHaveCount(1);
      await expect(faqPage.emptyState).not.toBeVisible();
    });
  }
);

test.describe(
  "Non-admin member sees read-only empty state on organization FAQ page",
  { tag: ["@desktop", "@mobile", "@member"] },
  () => {
    test.use({ storageState: MEMBER_AUTH_STATE_PATH });

    test.afterEach(async ({ page }) => {
      await page.unrouteAll();
    });

    test("Shows read-only empty state when organization has no FAQ entries", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      await routeMockPublicOrganizationDetail(
        page,
        MOCK_ORGANIZATION_EMPTY_STATE_ID,
        mockOrganizationDetailPayload(MOCK_ORGANIZATION_EMPTY_STATE_ID, { faqEntries: [] })
      );
      await page.goto(`/organizations/${MOCK_ORGANIZATION_EMPTY_STATE_ID}/faq`);

      const { faqPage } = newOrganizationPage(page);
      await expect(faqPage.emptyState).toBeVisible({ timeout: 15000 });
      await expect(
        page.getByRole("heading", {
          level: 4,
          name: new RegExp(
            getEnglishText("i18n.components.empty_state.message_no_permission"),
            "i"
          ),
        })
      ).toBeVisible();
      await expect(faqPage.newFAQButton).not.toBeVisible();
    });
  }
);
