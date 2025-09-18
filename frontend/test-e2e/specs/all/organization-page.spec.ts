// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { signInAsAdmin } from "~/test-e2e/actions/authentication";
import { navigateToFirstOrganization } from "~/test-e2e/actions/navigation";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";

test.beforeEach(async ({ page }) => {
  await signInAsAdmin(page);
  await navigateToFirstOrganization(page);
});

test.describe("Organization Page", { tag: ["@desktop", "@mobile"] }, () => {
  // Note: Check to make sure that this is eventually done for light and dark modes.
  test.skip("Organization Page has no detectable accessibility issues", async ({
    page,
  }, testInfo) => {
    const violations = await runAccessibilityTest(
      "Organization Page",
      page,
      testInfo
    );
    expect.soft(violations, "Accessibility violations found:").toHaveLength(0);

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

  test("User can edit the Connect section", async ({ page }) => {
    const organizationPage = newOrganizationPage(page);

    // Ensure we're on the About page
    await expect(page).toHaveURL(/.*\/organizations\/.*\/about/);
    await expect(organizationPage.aboutPage.connectCard).toBeVisible();

    // Click the edit icon to open the social links modal
    await expect(organizationPage.aboutPage.connectCardEditIcon).toBeVisible();
    await organizationPage.aboutPage.connectCardEditIcon.click();

    // Verify the social links modal appears
    await expect(organizationPage.socialLinksModal.modal).toBeVisible();

    // Verify the form and its fields are present
    const socialLinksForm = organizationPage.socialLinksModal.form(
      organizationPage.socialLinksModal.modal
    );
    await expect(socialLinksForm).toBeVisible();

    // Generate unique content for this test run
    const timestamp = Date.now();
    const newLabel = `New Social Link ${timestamp}`;
    const newUrl = `https://new-social.activist.org/${timestamp}`;
    const editedLabel = `Edited Social Link ${timestamp}`;
    const editedUrl = `https://edited-social.activist.org/${timestamp}`;

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
    await expect(newLabelField).toBeEditable();
    await expect(newUrlField).toBeVisible();
    await expect(newUrlField).toBeEditable();

    await newLabelField.clear();
    await newLabelField.fill(newLabel);

    await newUrlField.clear();
    await newUrlField.fill(newUrl);

    // Edit an existing social link (if any exist, use index 0)
    if (initialCount > 0) {
      const existingLabelField = organizationPage.socialLinksModal.labelField(
        organizationPage.socialLinksModal.modal,
        0
      );
      const existingUrlField = organizationPage.socialLinksModal.urlField(
        organizationPage.socialLinksModal.modal,
        0
      );

      await expect(existingLabelField).toBeVisible();
      await expect(existingLabelField).toBeEditable();
      await expect(existingUrlField).toBeVisible();
      await expect(existingUrlField).toBeEditable();

      await existingLabelField.clear();
      await existingLabelField.fill(editedLabel);

      await existingUrlField.clear();
      await existingUrlField.fill(editedUrl);

      // Verify edited field
      await expect(existingLabelField).toHaveValue(editedLabel);
      await expect(existingUrlField).toHaveValue(editedUrl);
    }

    // Verify new field
    await expect(newLabelField).toHaveValue(newLabel);
    await expect(newUrlField).toHaveValue(newUrl);

    // Submit the form to save changes
    const submitButton = organizationPage.socialLinksModal.submitButton(
      organizationPage.socialLinksModal.modal
    );
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText("Update links");
    await submitButton.click();

    // Wait for the modal to close after successful save
    await expect(organizationPage.socialLinksModal.modal).not.toBeVisible();

    // Verify the changes are reflected on the Connect card
    const connectCard = organizationPage.aboutPage.connectCard;

    // Verify the newly added social link appears
    await expect(connectCard).toContainText(newLabel);
    const newSocialLink = connectCard.getByRole("link", {
      name: new RegExp(newLabel, "i"),
    });
    await expect(newSocialLink).toBeVisible();
    await expect(newSocialLink).toHaveAttribute("href", newUrl);

    // Verify the edited social link appears (if there was an existing one to edit)
    if (initialCount > 0) {
      await expect(connectCard).toContainText(editedLabel);
      const editedSocialLink = connectCard.getByRole("link", {
        name: new RegExp(editedLabel, "i"),
      });
      await expect(editedSocialLink).toBeVisible();
      await expect(editedSocialLink).toHaveAttribute("href", editedUrl);
    }

    // Third: Delete the newly created social link
    // Re-open the social links modal to delete the new entry
    await expect(organizationPage.aboutPage.connectCardEditIcon).toBeVisible();
    await organizationPage.aboutPage.connectCardEditIcon.click();

    // Verify the social links modal appears again
    await expect(organizationPage.socialLinksModal.modal).toBeVisible();

    // Delete the newly added social link entry (at the last index)
    const deleteButton = organizationPage.socialLinksModal.removeButton(
      organizationPage.socialLinksModal.modal,
      newEntryIndex
    );
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // Submit the form to save the deletion
    const deleteSubmitButton = organizationPage.socialLinksModal.submitButton(
      organizationPage.socialLinksModal.modal
    );
    await expect(deleteSubmitButton).toBeVisible();
    await expect(deleteSubmitButton).toContainText("Update links");
    await deleteSubmitButton.click();

    // Wait for the modal to close after successful deletion
    await expect(organizationPage.socialLinksModal.modal).not.toBeVisible();

    // Verify the deleted social link no longer appears on the Connect card
    const connectCardAfterDeletion = organizationPage.aboutPage.connectCard;
    await expect(connectCardAfterDeletion).not.toContainText(newLabel);

    // Verify the edited social link still exists (should not be affected by deletion)
    if (initialCount > 0) {
      await expect(connectCardAfterDeletion).toContainText(editedLabel);
      const editedSocialLinkAfterDeletion = connectCardAfterDeletion.getByRole(
        "link",
        { name: new RegExp(editedLabel, "i") }
      );
      await expect(editedSocialLinkAfterDeletion).toBeVisible();
      await expect(editedSocialLinkAfterDeletion).toHaveAttribute(
        "href",
        editedUrl
      );
    }
  });
});
