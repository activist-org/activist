import { MEMBER_AUTH_STATE_PATH } from "~/test-e2e/constants/authPaths";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationFAQPage } from "~/test-e2e/page-objects/organization/faq/OrganizationFAQPage";
import { getEnglishText } from "~/test-e2e/utils/i18n";
import { logTestPath } from "~/test-e2e/utils/log-test-path";
import {
  MOCK_ORGANIZATION_EMPTY_STATE_ID,
  mockOrganizationDetailPayload,
  routeMockPublicOrganizationDetail,
  sampleFaqEntryForMock,
} from "~/test-e2e/utils/mock-public-organization-detail";

test.describe(
  "Organization FAQ Empty States",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.beforeEach(async (_, testInfo) => {
      logTestPath(testInfo);
    });

    test("Admin sees the empty state with the create button when no FAQs exist", async ({
      page,
    }) => {
      const faqPage = newOrganizationFAQPage(
        page,
        MOCK_ORGANIZATION_EMPTY_STATE_ID
      );

      await routeMockPublicOrganizationDetail(
        page,
        MOCK_ORGANIZATION_EMPTY_STATE_ID,
        mockOrganizationDetailPayload(MOCK_ORGANIZATION_EMPTY_STATE_ID, {
          faqEntries: [],
        })
      );

      await faqPage.goto();

      await expect(
        page.getByText(
          getEnglishText("i18n.components.empty_state.message_with_permission")
        )
      ).toBeVisible();
      await expect(faqPage.newFAQButton).toBeVisible();
      await expect(page.getByRole("list")).toBeHidden();
    });

    test(
      "Viewer sees the empty state without the create button",
      { tag: ["@member"] },
      async ({ browser }) => {
        const context = await browser.newContext({
          storageState: MEMBER_AUTH_STATE_PATH,
        });
        const page = await context.newPage();
        const faqPage = newOrganizationFAQPage(
          page,
          MOCK_ORGANIZATION_EMPTY_STATE_ID
        );

        await routeMockPublicOrganizationDetail(
          page,
          MOCK_ORGANIZATION_EMPTY_STATE_ID,
          mockOrganizationDetailPayload(MOCK_ORGANIZATION_EMPTY_STATE_ID, {
            faqEntries: [],
          })
        );

        await faqPage.goto();

        await expect(
          page.getByText(
            getEnglishText("i18n.components.empty_state.message_no_permission")
          )
        ).toBeVisible();
        await expect(faqPage.newFAQButton).toBeHidden();
        await expect(page.getByRole("list")).toBeHidden();

        await context.close();
      }
    );

    test("List is shown and empty state is hidden when FAQs exist", async ({
      page,
    }) => {
      const faqPage = newOrganizationFAQPage(
        page,
        MOCK_ORGANIZATION_EMPTY_STATE_ID
      );

      await routeMockPublicOrganizationDetail(
        page,
        MOCK_ORGANIZATION_EMPTY_STATE_ID,
        mockOrganizationDetailPayload(MOCK_ORGANIZATION_EMPTY_STATE_ID, {
          faqEntries: [sampleFaqEntryForMock()],
        })
      );

      await faqPage.goto();

      await expect(
        page.getByText(
          getEnglishText("i18n.components.empty_state.message_with_permission")
        )
      ).toBeHidden();
      await expect(
        page.getByText(
          getEnglishText("i18n.components.empty_state.message_no_permission")
        )
      ).toBeHidden();
    });
  }
);
