// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { logTestPath } from "~/test-e2e/utils/testTraceability";
import { getEnglishText } from "~/utils/i18n";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToOrganizationGroupSubpage(page, "about");
});

test.describe(
  "Organization Group About Page - Content Editing",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.setTimeout(60000); // Group pages load slowly in dev mode

    test("User can edit the About section", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupAboutPage } = organizationPage;

      // Ensure we're on the About page.
      await expect(page).toHaveURL(/.*\/groups\/.*\/about/);
      await expect(groupAboutPage.aboutCard).toBeVisible();

      // Click the edit icon to open the edit modal.
      const aboutCardEditIcon =
        groupAboutPage.aboutCard.getByTestId("edit-icon");
      await expect(aboutCardEditIcon).toBeVisible();
      await aboutCardEditIcon.click();

      // Verify the edit modal appears.
      await expect(groupAboutPage.textModal).toBeVisible();

      // Verify the form and its fields are present.
      const editForm = groupAboutPage.textModal.getByRole("form");
      await expect(editForm).toBeVisible();

      // Verify specific editable text fields.
      const descriptionField = groupAboutPage.textModal.getByRole("textbox", {
        name: new RegExp(getEnglishText("i18n._global.description"), "i"),
      });
      const getInvolvedField = groupAboutPage.textModal.getByRole("textbox", {
        name: new RegExp(
          getEnglishText("i18n.components._global.get_involved"),
          "i"
        ),
      });
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

      // Generate unique content for this test run.
      const timestamp = Date.now();
      const customDescription = `Test group description updated at ${timestamp}`;
      const customGetInvolved = `Join our group movement - Test run ${timestamp}`;
      const customJoinUrl = `https://test.activist.org/join-group?run=${timestamp}`;

      await descriptionField.clear();
      await descriptionField.fill(customDescription);

      await getInvolvedField.clear();
      await getInvolvedField.fill(customGetInvolved);

      await joinUrlField.clear();
      await joinUrlField.fill(customJoinUrl);

      // Verify the fields contain the new text.
      await expect(descriptionField).toHaveValue(customDescription);
      await expect(getInvolvedField).toHaveValue(customGetInvolved);
      await expect(joinUrlField).toHaveValue(customJoinUrl);

      // Submit the form to save changes.
      const submitButton = groupAboutPage.textModal.getByRole("button", {
        name: new RegExp(getEnglishText("i18n.components.submit"), "i"),
      });
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toContainText("Update texts");
      await submitButton.click();

      // Wait for the modal to close after successful save.
      await expect(groupAboutPage.textModal).not.toBeVisible();

      // Verify the changes are reflected on the page.
      // The description should be visible in the about card.
      const { aboutCard } = groupAboutPage;
      await expect(aboutCard).toContainText(customDescription);

      // The get involved text should be visible in the get involved card.
      const { getInvolvedCard } = groupAboutPage;
      await expect(getInvolvedCard).toContainText(customGetInvolved);
      // Verify the join button URL was updated.
      const joinButton = groupAboutPage.getInvolvedCard.getByTestId(
        "get-involved-join-button"
      );
      await expect(joinButton).toBeVisible();
      await expect(joinButton).toHaveAttribute("href", customJoinUrl);
    });
  }
);
