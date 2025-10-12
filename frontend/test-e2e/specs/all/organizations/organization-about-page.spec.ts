// SPDX-License-Identifier: AGPL-3.0-or-later
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { navigateToFirstOrganization } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";
import { submitModalWithRetry } from "~/test-e2e/utils/modalHelpers";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToFirstOrganization(page);

  // Wait for auth state to be fully loaded.
  await page.waitForLoadState("domcontentloaded");

  // Give Nuxt Auth time to hydrate session from cookies.
  await page.waitForTimeout(1000);
});

test.describe(
  "Organization About Page",
  { tag: ["@desktop", "@mobile"] },
  () => {
    // Increase test timeout for slow dev mode loading.
    test.setTimeout(60000);
    // Note: Check to make sure that this is eventually done for light and dark modes.
    test("Organization About Page has no detectable accessibility issues", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      await withTestStep(testInfo, "Run accessibility scan", async () => {
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
    });

    test("User can share the organization page", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);

      await withTestStep(testInfo, "Open share modal", async () => {
        await organizationPage.shareButton.click();
        await expect(organizationPage.shareModal.modal).toBeVisible();
      });

      await withTestStep(testInfo, "Close share modal", async () => {
        const closeModalButton = organizationPage.shareModal.closeButton(
          organizationPage.shareModal.modal
        );
        await expect(closeModalButton).toBeVisible();
        await closeModalButton.click({ force: true });
        await expect(organizationPage.shareModal.modal).not.toBeVisible();
      });
    });

    test("User can edit the About section", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);

      // Ensure we're on the About page.
      await expect(page).toHaveURL(/.*\/organizations\/.*\/about/, {
        timeout: 10000,
      });

      // Wait for page to be ready.
      await page.waitForLoadState("domcontentloaded");

      // Wait for the about card to be visible.
      await expect(organizationPage.aboutPage.aboutCard).toBeVisible({
        timeout: 15000,
      });

      // Wait for edit icon to be available (auth state should be loaded).
      await expect(organizationPage.aboutPage.aboutCardEditIcon).toBeVisible({
        timeout: 10000,
      });

      // Click the edit icon to open the edit modal.
      await organizationPage.aboutPage.aboutCardEditIcon.click();

      // Verify the edit modal appears.
      await expect(organizationPage.editModal.modal).toBeVisible();

      // Verify the form and its fields are present.
      const editForm = organizationPage.editModal.form(
        organizationPage.editModal.modal
      );
      await expect(editForm).toBeVisible();

      // Verify specific editable text fields.
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
      const getInvolvedText = organizationPage.aboutPage.getInvolvedCardText;
      await expect(getInvolvedText).toContainText(customGetInvolved);

      // Verify the join button URL was updated (this will wait for the element to be ready).
      const joinButton = organizationPage.aboutPage.getInvolvedJoinButton;
      await expect(joinButton).toBeVisible();
      await expect(joinButton).toHaveAttribute("href", customJoinUrl);
    });

    test("User can manage social links (CREATE, UPDATE, DELETE)", async ({
      page,
    }) => {
      const organizationPage = newOrganizationPage(page);

      // Ensure we're on the About page.
      await expect(page).toHaveURL(/.*\/organizations\/.*\/about/, {
        timeout: 10000,
      });

      // Wait for page to be fully loaded (network requests complete) - longer timeout for dev mode.
      await page.waitForLoadState("domcontentloaded");

      // Wait for the connect card to be visible (longer timeout for slow dev mode loading).
      await expect(organizationPage.aboutPage.connectCard).toBeVisible({
        timeout: 15000,
      });

      // Generate unique content for this test run.
      const timestamp = Date.now();
      const newLabel = `Test Social Link ${timestamp}`;
      const newUrl = `https://test-social-${timestamp}.com`;
      const updatedLabel = `Updated Social Link ${timestamp}`;
      const updatedUrl = `https://updated-${timestamp}.com`;

      // PHASE 1: CREATE - Add a new social link.
      await organizationPage.aboutPage.connectCardEditIcon.click();
      await expect(organizationPage.socialLinksModal.modal).toBeVisible();

      // Count existing social link entries using data-testid.
      const existingEntries = await organizationPage.socialLinksModal.modal
        .getByTestId(/^social-link-entry-/)
        .all();
      const initialCount = existingEntries.length;

      // Add a new social link
      const addButton = organizationPage.socialLinksModal.addButton(
        organizationPage.socialLinksModal.modal
      );
      await expect(addButton).toBeVisible();
      // Use JavaScript click to bypass viewport restrictions on mobile.
      await addButton.evaluate((btn) => (btn as HTMLElement).click());

      // Wait for the new entry to appear.
      await expect(
        organizationPage.socialLinksModal.modal.getByTestId(
          /^social-link-entry-/
        )
      ).toHaveCount(initialCount + 1);

      // Use the newly added entry (at the last index).
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

      await newLabelField.pressSequentially(newLabel);
      await newUrlField.pressSequentially(newUrl);

      // Verify the fields contain the entered text.
      await expect(newLabelField).toHaveValue(newLabel);
      await expect(newUrlField).toHaveValue(newUrl);

      // Save the new social link with retry logic.
      const submitButton = organizationPage.socialLinksModal.submitButton(
        organizationPage.socialLinksModal.modal
      );
      await submitModalWithRetry(
        page,
        organizationPage.socialLinksModal.modal,
        submitButton,
        "CREATE"
      );

      // Wait for the modal to close and page to update.
      await expect(organizationPage.socialLinksModal.modal).not.toBeVisible({
        timeout: 10000,
      });

      // Verify the new social link appears on the Connect card.
      const { connectCard } = organizationPage.aboutPage;

      // Check if social links were created (with flexible timeout).
      let allSocialLinks = 0;
      try {
        await expect(connectCard.locator("a[href]").first()).toBeVisible({
          timeout: 10000,
        });
        allSocialLinks = await connectCard.locator("a[href]").count();
      } catch {
        // CREATE might have failed, check if any links exist at all.
        allSocialLinks = await connectCard.locator("a[href]").count();

        if (allSocialLinks === 0) {
          throw new Error("No social links found after CREATE operation");
        }
      }

      // PHASE 2: UPDATE - Edit the social link we just created.
      await organizationPage.aboutPage.connectCardEditIcon.click();
      await expect(organizationPage.socialLinksModal.modal).toBeVisible();

      // Find the social link we created by looking for our unique label using test IDs.
      const availableEntries = await organizationPage.socialLinksModal.modal
        .getByTestId(/^social-link-label-/)
        .all();

      if (availableEntries.length === 0) {
        throw new Error("No social links available to update");
      }

      // Find the entry that contains our created label.
      let targetIndex = -1;
      for (let i = 0; i < availableEntries.length; i++) {
        const value = await availableEntries[i]?.inputValue();
        if (value === newLabel) {
          targetIndex = i;
          break;
        }
      }

      if (targetIndex === -1) {
        throw new Error(
          "Could not find the social link we created for updating"
        );
      }

      // Edit the social link we created.
      const editLabelField = organizationPage.socialLinksModal.labelField(
        organizationPage.socialLinksModal.modal,
        targetIndex
      );
      const editUrlField = organizationPage.socialLinksModal.urlField(
        organizationPage.socialLinksModal.modal,
        targetIndex
      );

      await expect(editLabelField).toBeVisible();
      await expect(editUrlField).toBeVisible();

      // Get the current values (whatever they are).
      const currentLabel = await editLabelField.inputValue();
      const currentUrl = await editUrlField.inputValue();
      // No need to verify specific values - just ensure fields have some content.
      expect(currentLabel).toBeTruthy();
      expect(currentUrl).toBeTruthy();

      // Update the values.
      await editLabelField.clear();
      await editLabelField.pressSequentially(updatedLabel);

      await editUrlField.clear();
      await editUrlField.pressSequentially(updatedUrl);

      // Verify the fields contain the updated text.
      await expect(editLabelField).toHaveValue(updatedLabel);
      await expect(editUrlField).toHaveValue(updatedUrl);

      // Save the changes with retry logic.
      const updateSubmitButton = organizationPage.socialLinksModal.submitButton(
        organizationPage.socialLinksModal.modal
      );
      await submitModalWithRetry(
        page,
        organizationPage.socialLinksModal.modal,
        updateSubmitButton,
        "UPDATE"
      );

      // Wait for the modal to close and page to update.
      await expect(organizationPage.socialLinksModal.modal).not.toBeVisible({
        timeout: 10000,
      });

      // Verify the updated social link appears on the Connect card.
      // Use getByTestId and filter by text since accessible name might include icon.
      await expect(
        connectCard.getByTestId("social-link").filter({ hasText: updatedLabel })
      ).toBeVisible({ timeout: 10000 });
      await expect(
        connectCard.getByTestId("social-link").filter({ hasText: updatedLabel })
      ).toHaveAttribute("href", updatedUrl);

      // PHASE 3: DELETE - Remove the social link we updated.
      await organizationPage.aboutPage.connectCardEditIcon.click();
      await expect(organizationPage.socialLinksModal.modal).toBeVisible();

      // Get the current form entries using test IDs.
      const allLabelInputs = await organizationPage.socialLinksModal.modal
        .getByTestId(/^social-link-label-/)
        .all();

      if (allLabelInputs.length === 0) {
        throw new Error("No social links available to delete");
      }

      // Find the entry that contains our updated label.
      let deleteIndex = -1;
      const foundValues = [];

      for (let i = 0; i < allLabelInputs.length; i++) {
        const value = await allLabelInputs[i]?.inputValue();
        foundValues.push(value);

        // Try exact match first.
        if (value === updatedLabel) {
          deleteIndex = i;
          break;
        }

        // Fallback: try to find by the original label if update didn't work.
        if (value === newLabel) {
          deleteIndex = i;
          break;
        }
      }

      if (deleteIndex === -1) {
        throw new Error(
          `Could not find the social link we updated for deletion. Looking for: "${updatedLabel}", Found: [${foundValues.join(", ")}]`
        );
      }

      // Delete the social link we updated.
      const deleteButton = organizationPage.socialLinksModal.removeButton(
        organizationPage.socialLinksModal.modal,
        deleteIndex
      );
      await expect(deleteButton).toBeVisible();
      await deleteButton.click();

      // Save the deletion with retry logic.
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

      // Verify the deleted social link no longer appears on the Connect card.
      // Use getByTestId and filter by text since accessible name might include icon.
      await expect(
        connectCard.getByTestId("social-link").filter({ hasText: updatedLabel })
      ).not.toBeVisible({
        timeout: 10000,
      });
    });

    test("User can upload image (CREATE, UPDATE, DELETE)", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);

      // Ensure we're on the About page.
      await expect(page).toHaveURL(/.*\/organizations\/.*\/about/, {
        timeout: 10000,
      });

      // Wait for page to be ready.
      await page.waitForLoadState("domcontentloaded");

      // Wait for the about card to be visible.
      await expect(organizationPage.aboutPage.imageCarousel).toBeVisible({
        timeout: 15000,
      });

      // Wait for edit icon to be available (auth state should be loaded).
      await expect(
        organizationPage.aboutPage.imageCarouselEditIcon
      ).toBeVisible({
        timeout: 10000,
      });

      // Click the edit icon to open the image upload modal.
      await organizationPage.aboutPage.imageCarouselEditIcon.click();

      // Verify the image upload modal appears.
      await expect(organizationPage.uploadImageModal.modal).toBeVisible();

      // Verify the image upload form is visible.
      const imageUploadInput =
        organizationPage.uploadImageModal.imageUploadInput(
          organizationPage.uploadImageModal.modal
        );
      await expect(imageUploadInput).toBeEnabled();
      await expect(imageUploadInput).toBeEditable();

      // Count initial number of files uploaded in the modal.
      const existingUploadEntries = await organizationPage.uploadImageModal
        .getUploadedImages(organizationPage.uploadImageModal.modal)
        .all();
      const existingUploadEntriesCount = existingUploadEntries.length;

      // Set image input.
      const filePng = {
        name: "file.png",
        mimeType: "image/png",
        buffer: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC",
          "base64"
        ),
      };
      await imageUploadInput.setInputFiles(filePng);

      // New entry appears in the modal.
      await expect(
        organizationPage.uploadImageModal.getUploadedImages(
          organizationPage.uploadImageModal.modal
        )
      ).toHaveCount(existingUploadEntriesCount + 1);

      // Upload image.
      await organizationPage.uploadImageModal
        .uploadButton(organizationPage.uploadImageModal.modal)
        .click();

      // Wait for the modal to close and page to update.
      await expect(organizationPage.uploadImageModal.modal).not.toBeVisible({
        timeout: 10000,
      });

      // Reload the page for the change to take effect.
      await page.reload();

      // Verify the number of image in the carousel matches the number of files in the modal.
      await expect(
        organizationPage.aboutPage.getImageCarouselImages
      ).toHaveCount(existingUploadEntriesCount + 1);

      // Open the modal and remove the first image
      await organizationPage.aboutPage.imageCarouselEditIcon.click();
      await organizationPage.uploadImageModal
        .removeButton(organizationPage.uploadImageModal.modal, 0)
        .click();

      // Number of files upload goes back to existing count.
      await expect(
        organizationPage.uploadImageModal.getUploadedImages(
          organizationPage.uploadImageModal.modal
        )
      ).toHaveCount(existingUploadEntriesCount);

      // Close the upload image modal.
      await organizationPage.uploadImageModal.closeButton(
        organizationPage.uploadImageModal.modal
      ).click()

      // Wait for the modal to close and page to update.
      await expect(organizationPage.uploadImageModal.modal).not.toBeVisible({
        timeout: 10000,
      });

      // Reload the page for the change to take effect.
      await page.reload();

      // Verify the number of image in the carousel matches the number of files in the modal.
      await expect(
        organizationPage.aboutPage.getImageCarouselImages
      ).toHaveCount(existingUploadEntriesCount);
    });
  }
);
