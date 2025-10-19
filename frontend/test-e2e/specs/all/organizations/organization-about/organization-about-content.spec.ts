// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToFirstOrganization } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToFirstOrganization(page);

  // Wait for auth state to be fully loaded.
  await page.waitForLoadState("domcontentloaded");

  // Wait intelligently for auth state to hydrate (no arbitrary delay).
  await expect(async () => {
    // Verify page is interactive and auth state is ready.
    const isReady = await page.evaluate(
      () => document.readyState === "complete"
    );
    expect(isReady).toBe(true);
  }).toPass({
    intervals: [100, 250],
  });
});

test.describe(
  "Organization About Page - Content Editing",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.setTimeout(60000); // increased timeout for slow dev mode loading

    test("User can edit the About section", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const { aboutPage, editModal } = organizationPage;

      // Ensure we're on the About page.
      await expect(page).toHaveURL(/.*\/organizations\/.*\/about/, {});

      // Wait for page to be ready.
      await page.waitForLoadState("domcontentloaded");

      // Wait for the about card to be visible.
      await expect(aboutPage.aboutCard).toBeVisible({
        timeout: 15000,
      });

      // Wait for edit icon to be available (auth state should be loaded).
      await expect(aboutPage.aboutCardEditIcon).toBeVisible({});

      // Click the edit icon to open the edit modal.
      await aboutPage.aboutCardEditIcon.click();

      // Verify the edit modal appears.
      await expect(editModal.modal).toBeVisible();

      // Verify the form and its fields are present.
      const editForm = editModal.form(editModal.modal);
      await expect(editForm).toBeVisible();

      // Verify specific editable text fields.
      const descriptionField = editModal.descriptionField(editModal.modal);
      const getInvolvedField = editModal.getInvolvedField(editModal.modal);
      const joinUrlField = editModal.joinUrlField(editModal.modal);

      await expect(descriptionField).toBeVisible();
      await expect(descriptionField).toBeEditable();
      await expect(getInvolvedField).toBeVisible();
      await expect(getInvolvedField).toBeEditable();
      await expect(joinUrlField).toBeVisible();
      await expect(joinUrlField).toBeEditable();

      // Generate unique content for this test run.
      const timestamp = Date.now();
      const customDescription = `Test description updated at ${timestamp}`;
      const customGetInvolved = `Join our movement - Test run ${timestamp}`;
      const customJoinUrl = `https://test.activist.org/join?run=${timestamp}`;

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
      const submitButton = organizationPage.editModal.submitButton(
        organizationPage.editModal.modal
      );
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toContainText("Update texts");
      await submitButton.click();

      // Wait for the modal to close after successful save.
      await expect(organizationPage.editModal.modal).not.toBeVisible();

      // Verify the changes are reflected on the page.
      // The description should be visible in the about card.
      const { aboutCard } = organizationPage.aboutPage;
      await expect(aboutCard).toContainText(customDescription);

      // The get involved text should be visible in the get involved card.
      const getInvolvedText = aboutPage.getInvolvedCardText;
      await expect(getInvolvedText).toContainText(customGetInvolved);
      // Verify the join button URL was updated (this will wait for the element to be ready).
      const joinButton = aboutPage.getInvolvedJoinButton;
      await expect(joinButton).toBeVisible();
      await expect(joinButton).toHaveAttribute("href", customJoinUrl);
    });
  }
);
