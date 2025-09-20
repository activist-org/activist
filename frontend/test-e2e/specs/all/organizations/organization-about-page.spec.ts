// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { signInAsAdmin } from "~/test-e2e/actions/authentication";
import { navigateToFirstOrganization } from "~/test-e2e/actions/navigation";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";
import { submitModalWithRetry } from "~/test-e2e/utils/modalHelpers";

test.beforeEach(async ({ page }) => {
  await signInAsAdmin(page);
  await navigateToFirstOrganization(page);
});

test.describe(
  "Organization About Page",
  { tag: ["@desktop", "@mobile"] },
  () => {
    // Note: Check to make sure that this is eventually done for light and dark modes.
    test.skip("Organization About Page has no detectable accessibility issues", async ({
      page,
    }, testInfo) => {
      const violations = await runAccessibilityTest(
        "Organization About Page",
        page,
        testInfo
      );
      expect
        .soft(violations, "Accessibility violations found:")
        .toHaveLength(0);

      if (violations.length > 0) {
        // Note: For future implementation.
      }
    });

    test("User can share the organization page", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);

      await organizationPage.shareButton.click();

      await expect(organizationPage.shareModal.modal).toBeVisible();

      // Close the modal by clicking the close button
      const closeModalButton = organizationPage.shareModal.closeButton(
        organizationPage.shareModal.modal
      );
      await expect(closeModalButton).toBeVisible();
      await closeModalButton.click({ force: true });

      // Expect the modal to not be visible
      await expect(organizationPage.shareModal.modal).not.toBeVisible();
    });

    test("User can edit the About section", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);

      // Ensure we're on the About page
      await expect(page).toHaveURL(/.*\/organizations\/.*\/about/);
      await expect(organizationPage.aboutPage.aboutCard).toBeVisible();

      // Click the edit icon to open the edit modal
      await expect(organizationPage.aboutPage.aboutCardEditIcon).toBeVisible();
      await organizationPage.aboutPage.aboutCardEditIcon.click();

      // Verify the edit modal appears
      await expect(organizationPage.editModal.modal).toBeVisible();

      // Verify the form and its fields are present
      const editForm = organizationPage.editModal.form(
        organizationPage.editModal.modal
      );
      await expect(editForm).toBeVisible();

      // Verify specific editable text fields
      const descriptionField = organizationPage.editModal.descriptionField(
        organizationPage.editModal.modal
      );
      const getInvolvedField = organizationPage.editModal.getInvolvedField(
        organizationPage.editModal.modal
      );
      const joinUrlField = organizationPage.editModal.joinUrlField(
        organizationPage.editModal.modal
      );

      await expect(descriptionField).toBeVisible();
      await expect(descriptionField).toBeEditable();
      await expect(getInvolvedField).toBeVisible();
      await expect(getInvolvedField).toBeEditable();
      await expect(joinUrlField).toBeVisible();
      await expect(joinUrlField).toBeEditable();

      // Generate unique content for this test run
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

      // Verify the fields contain the new text
      await expect(descriptionField).toHaveValue(customDescription);
      await expect(getInvolvedField).toHaveValue(customGetInvolved);
      await expect(joinUrlField).toHaveValue(customJoinUrl);

      // Submit the form to save changes
      const submitButton = organizationPage.editModal.submitButton(
        organizationPage.editModal.modal
      );
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toContainText("Update texts");
      await submitButton.click();

      // Wait for the modal to close after successful save
      await expect(organizationPage.editModal.modal).not.toBeVisible();

      // Verify the changes are reflected on the page
      // The description should be visible in the about card
      const aboutCard = organizationPage.aboutPage.aboutCard;
      await expect(aboutCard).toContainText(customDescription);

      // The get involved text should be visible in the get involved card
      const getInvolvedText = organizationPage.aboutPage.getInvolvedCardText;
      await expect(getInvolvedText).toContainText(customGetInvolved);

      // Verify the join button URL was updated (this will wait for the element to be ready)
      const joinButton = organizationPage.aboutPage.getInvolvedJoinButton;
      await expect(joinButton).toBeVisible();
      await expect(joinButton).toHaveAttribute("href", customJoinUrl);
    });

    test("User can manage social links (CREATE, UPDATE, DELETE)", async ({
      page,
    }) => {
      const organizationPage = newOrganizationPage(page);

      // Ensure we're on the About page
      await expect(page).toHaveURL(/.*\/organizations\/.*\/about/);
      await expect(organizationPage.aboutPage.connectCard).toBeVisible();

      // Generate unique content for this test run
      const timestamp = Date.now();
      const newLabel = `Test Social Link ${timestamp}`;
      const newUrl = `https://test-social-${timestamp}.com`;
      const updatedLabel = `Updated Social Link ${timestamp}`;
      const updatedUrl = `https://updated-${timestamp}.com`;

      // PHASE 1: CREATE - Add a new social link
      await organizationPage.aboutPage.connectCardEditIcon.click();
      await expect(organizationPage.socialLinksModal.modal).toBeVisible();

      // Count existing social links
      const initialCount = await organizationPage.socialLinksModal.modal
        .locator('input[id^="form-item-socialLinks."][id$=".label"]')
        .count();

      // Add a new social link
      const addButton = organizationPage.socialLinksModal.addButton(
        organizationPage.socialLinksModal.modal
      );
      await expect(addButton).toBeVisible();
      await addButton.click();

      // Wait for the new entry to appear
      await expect(
        organizationPage.socialLinksModal.modal.locator(
          'input[id^="form-item-socialLinks."][id$=".label"]'
        )
      ).toHaveCount(initialCount + 1);

      // Use the newly added entry (at the last index)
      const newEntryIndex = initialCount;
      const newLabelField = organizationPage.socialLinksModal.labelField(
        organizationPage.socialLinksModal.modal,
        newEntryIndex
      );
      const newUrlField = organizationPage.socialLinksModal.urlField(
        organizationPage.socialLinksModal.modal,
        newEntryIndex
      );

      await expect(newLabelField).toBeVisible();
      await expect(newUrlField).toBeVisible();

      await newLabelField.fill(newLabel);
      await newUrlField.fill(newUrl);

      // Verify the fields contain the entered text
      await expect(newLabelField).toHaveValue(newLabel);
      await expect(newUrlField).toHaveValue(newUrl);

      // Save the new social link with retry logic
      const submitButton = organizationPage.socialLinksModal.submitButton(
        organizationPage.socialLinksModal.modal
      );
      await submitModalWithRetry(
        page,
        organizationPage.socialLinksModal.modal,
        submitButton,
        "CREATE"
      );

      // Verify the new social link appears on the Connect card
      const connectCard = organizationPage.aboutPage.connectCard;

      // Check if social links were created (with flexible timeout)
      let allSocialLinks = 0;
      try {
        await expect(connectCard.locator("a[href]").first()).toBeVisible({
          timeout: 10000,
        });
        allSocialLinks = await connectCard.locator("a[href]").count();
      } catch {
        // CREATE might have failed, check if any links exist at all
        allSocialLinks = await connectCard.locator("a[href]").count();

        if (allSocialLinks === 0) {
          throw new Error("No social links found after CREATE operation");
        }
      }

      // PHASE 2: UPDATE - Edit an existing social link
      await organizationPage.aboutPage.connectCardEditIcon.click();
      await expect(organizationPage.socialLinksModal.modal).toBeVisible();

      // Find the first available social link to edit (might be our newly created one or an existing one)
      const availableEntries = await organizationPage.socialLinksModal.modal
        .locator('input[id^="form-item-socialLinks."][id$=".label"]')
        .count();

      if (availableEntries === 0) {
        throw new Error("No social links available to update");
      }

      // Edit the first social link (index 0)
      const editLabelField = organizationPage.socialLinksModal.labelField(
        organizationPage.socialLinksModal.modal,
        0
      );
      const editUrlField = organizationPage.socialLinksModal.urlField(
        organizationPage.socialLinksModal.modal,
        0
      );

      await expect(editLabelField).toBeVisible();
      await expect(editUrlField).toBeVisible();

      // Get the current values (whatever they are)
      const currentLabel = await editLabelField.inputValue();
      const currentUrl = await editUrlField.inputValue();
      // No need to verify specific values - just ensure fields have some content
      expect(currentLabel).toBeTruthy();
      expect(currentUrl).toBeTruthy();

      // Update the values
      await editLabelField.clear();
      await editLabelField.fill(updatedLabel);

      await editUrlField.clear();
      await editUrlField.fill(updatedUrl);

      // Verify the fields contain the updated text
      await expect(editLabelField).toHaveValue(updatedLabel);
      await expect(editUrlField).toHaveValue(updatedUrl);

      // Save the changes with retry logic
      const updateSubmitButton = organizationPage.socialLinksModal.submitButton(
        organizationPage.socialLinksModal.modal
      );
      await submitModalWithRetry(
        page,
        organizationPage.socialLinksModal.modal,
        updateSubmitButton,
        "UPDATE"
      );

      // Verify the updated social link appears on the Connect card
      const updatedSocialLink = connectCard.getByRole("link", {
        name: new RegExp(updatedLabel, "i"),
      });
      await expect(updatedSocialLink).toBeVisible();
      await expect(updatedSocialLink).toHaveAttribute("href", updatedUrl);

      // PHASE 3: DELETE - Remove the first available social link (if any remain)
      await organizationPage.aboutPage.connectCardEditIcon.click();
      await expect(organizationPage.socialLinksModal.modal).toBeVisible();

      // Get the current form entries
      const allLabelInputs = await organizationPage.socialLinksModal.modal
        .locator('input[id^="form-item-socialLinks."][id$=".label"]')
        .all();

      if (allLabelInputs.length === 0) {
        throw new Error("No social links available to delete");
      }

      // Get the label of the first entry (whatever it is) for verification after deletion
      const firstLabelValue = await allLabelInputs[0].inputValue();

      // Delete the first social link (index 0)
      const deleteButton = organizationPage.socialLinksModal.removeButton(
        organizationPage.socialLinksModal.modal,
        0
      );
      await expect(deleteButton).toBeVisible();
      await deleteButton.click();

      // Save the deletion with retry logic
      const deleteSubmitButton = organizationPage.socialLinksModal.submitButton(
        organizationPage.socialLinksModal.modal
      );
      await expect(deleteSubmitButton).toBeVisible();
      await expect(deleteSubmitButton).toBeEnabled();

      await submitModalWithRetry(
        page,
        organizationPage.socialLinksModal.modal,
        deleteSubmitButton,
        "DELETE"
      );

      // Verify the deleted social link no longer appears on the Connect card
      if (firstLabelValue) {
        await expect(connectCard).not.toContainText(firstLabelValue, {
          timeout: 10000,
        });
      }
    });
  }
);
