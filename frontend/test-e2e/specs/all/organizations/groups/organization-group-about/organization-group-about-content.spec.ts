// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "#shared/utils/i18n";

import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToOrganizationGroupSubpage(page, "about");
});

test.describe(
  "Organization Group About Page - Content Editing",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.setTimeout(60000); // group pages load slowly in dev mode

    test("User can edit the About section", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupAboutPage } = organizationPage;

      const timestamp = Date.now();
      const customDescription = `Test group description updated at ${timestamp}`;
      const customGetInvolved = `Join our group movement - Test run ${timestamp}`;
      const customJoinUrl = `https://test.activist.org/join-group?run=${timestamp}`;

      const { descriptionField, getInvolvedField, joinUrlField } =
        await withTestStep(testInfo, "Open About edit modal", async () => {
          await expect(page).toHaveURL(/.*\/groups\/.*\/about/);
          await expect(groupAboutPage.aboutCard).toBeVisible();

          const aboutCardEditIcon =
            groupAboutPage.aboutCard.getByTestId("icon-edit");
          await expect(aboutCardEditIcon).toBeVisible();
          await aboutCardEditIcon.click();

          await expect(groupAboutPage.textModal).toBeVisible();

          const editForm = groupAboutPage.textModal.getByRole("form");
          await expect(editForm).toBeVisible();

          const descriptionField = groupAboutPage.textModal.getByRole(
            "textbox",
            {
              name: new RegExp(getEnglishText("i18n._global.description"), "i"),
            }
          );
          const getInvolvedField = groupAboutPage.textModal.getByRole(
            "textbox",
            {
              name: new RegExp(
                getEnglishText("i18n.components._global.get_involved"),
                "i"
              ),
            }
          );
          const joinUrlField = groupAboutPage.textModal.getByRole("textbox", {
            name: new RegExp(
              getEnglishText("i18n.components.modal_text_group.join_group_link"),
              "i"
            ),
          });

          await expect(descriptionField).toBeVisible();
          await expect(descriptionField).toBeEditable();
          await expect(getInvolvedField).toBeVisible();
          await expect(getInvolvedField).toBeEditable();
          await expect(joinUrlField).toBeVisible();
          await expect(joinUrlField).toBeEditable();

          return { descriptionField, getInvolvedField, joinUrlField };
        });

      await withTestStep(testInfo, "Fill and submit About form", async () => {
        await descriptionField.clear();
        await descriptionField.fill(customDescription);

        await getInvolvedField.clear();
        await getInvolvedField.fill(customGetInvolved);

        await joinUrlField.clear();
        await joinUrlField.fill(customJoinUrl);

        await expect(descriptionField).toHaveValue(customDescription);
        await expect(getInvolvedField).toHaveValue(customGetInvolved);
        await expect(joinUrlField).toHaveValue(customJoinUrl);

        const submitButton = groupAboutPage.textModal.getByRole("button", {
          name: new RegExp(getEnglishText("i18n.components.submit"), "i"),
        });
        await expect(submitButton).toBeVisible();
        await expect(submitButton).toContainText("Update texts");
        await submitButton.click();

        await expect(groupAboutPage.textModal).not.toBeVisible();
      });

      await withTestStep(testInfo, "Assert About content on page", async () => {
        const { aboutCard } = groupAboutPage;
        await expect(aboutCard).toContainText(customDescription);

        const { getInvolvedCard } = groupAboutPage;
        await expect(getInvolvedCard).toContainText(customGetInvolved);

        const joinButton = groupAboutPage.getInvolvedCard.getByTestId(
          "get-involved-join-button"
        );
        await expect(joinButton).toBeVisible();
        await expect(joinButton).toHaveAttribute("href", customJoinUrl);
      });
    });
  }
);
