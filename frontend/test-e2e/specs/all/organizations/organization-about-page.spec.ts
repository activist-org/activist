// SPDX-License-Identifier: AGPL-3.0-or-later
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { navigateToFirstOrganization } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { submitModalWithRetry } from "~/test-e2e/utils/modalHelpers";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

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
    timeout: 3000,
    intervals: [100, 250],
  });
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
      const { shareModal } = organizationPage;

      await withTestStep(testInfo, "Open share modal", async () => {
        await organizationPage.shareButton.click();
        await expect(shareModal.modal).toBeVisible();
      });

      await withTestStep(testInfo, "Close share modal", async () => {
        const closeModalButton = shareModal.closeButton(shareModal.modal);
        await expect(closeModalButton).toBeVisible();
        await closeModalButton.click({ force: true });
        await expect(shareModal.modal).not.toBeVisible();
      });
    });

    test("User can edit the About section", async ({ page }) => {
      const organizationPage = newOrganizationPage(page);
      const { aboutPage, editModal } = organizationPage;

      // Ensure we're on the About page.
      await expect(page).toHaveURL(/.*\/organizations\/.*\/about/, {
        timeout: 10000,
      });

      // Wait for page to be ready.
      await page.waitForLoadState("domcontentloaded");

      // Wait for the about card to be visible.
      await expect(aboutPage.aboutCard).toBeVisible({
        timeout: 15000,
      });

      // Wait for edit icon to be available (auth state should be loaded).
      await expect(aboutPage.aboutCardEditIcon).toBeVisible({
        timeout: 10000,
      });

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

    test("User can manage social links (CREATE, UPDATE, DELETE)", async ({
      page,
    }) => {
      const organizationPage = newOrganizationPage(page);
      const { aboutPage, socialLinksModal } = organizationPage;

      // Ensure we're on the About page.
      await expect(page).toHaveURL(/.*\/organizations\/.*\/about/, {
        timeout: 10000,
      });

      // Wait for page to be fully loaded (network requests complete) - longer timeout for dev mode.
      await page.waitForLoadState("domcontentloaded");

      // Wait for the connect card to be visible (longer timeout for slow dev mode loading).
      await expect(aboutPage.connectCard).toBeVisible({
        timeout: 15000,
      });

      // Generate unique content for this test run.
      const timestamp = Date.now();
      const newLabel = `Test Social Link ${timestamp}`;
      const newUrl = `https://test-social-${timestamp}.com`;
      const updatedLabel = `Updated Social Link ${timestamp}`;
      const updatedUrl = `https://updated-${timestamp}.com`;

      // PHASE 1: CREATE - Add a new social link.
      await aboutPage.connectCardEditIcon.click();
      await expect(socialLinksModal.modal).toBeVisible();

      // Count existing social link entries using data-testid.
      const existingEntries = await socialLinksModal.modal
        .getByTestId(/^social-link-entry-/)
        .all();
      const initialCount = existingEntries.length;

      // Add a new social link
      const addButton = socialLinksModal.addButton(socialLinksModal.modal);
      await expect(addButton).toBeVisible();
      // Use JavaScript click to bypass viewport restrictions on mobile.
      await addButton.evaluate((btn) => (btn as HTMLElement).click());

      // Wait for the new entry to appear.
      await expect(
        socialLinksModal.modal.getByTestId(/^social-link-entry-/)
      ).toHaveCount(initialCount + 1);

      // Use the newly added entry (at the last index).
      const newEntryIndex = initialCount;
      const newLabelField = socialLinksModal.labelField(
        socialLinksModal.modal,
        newEntryIndex
      );
      const newUrlField = socialLinksModal.urlField(
        socialLinksModal.modal,
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
      const submitButton = socialLinksModal.submitButton(
        socialLinksModal.modal
      );
      await submitModalWithRetry(
        page,
        socialLinksModal.modal,
        submitButton,
        "CREATE"
      );

      // Wait for the modal to close and page to update.
      await expect(socialLinksModal.modal).not.toBeVisible({
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
      await aboutPage.connectCardEditIcon.click();
      await expect(socialLinksModal.modal).toBeVisible();

      // Find the social link we created by looking for our unique label using test IDs.
      const availableEntries = await socialLinksModal.modal
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
      const editLabelField = socialLinksModal.labelField(
        socialLinksModal.modal,
        targetIndex
      );
      const editUrlField = socialLinksModal.urlField(
        socialLinksModal.modal,
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
      const updateSubmitButton = socialLinksModal.submitButton(
        socialLinksModal.modal
      );
      await submitModalWithRetry(
        page,
        socialLinksModal.modal,
        updateSubmitButton,
        "UPDATE"
      );

      // Wait for the modal to close and page to update.
      await expect(socialLinksModal.modal).not.toBeVisible({
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
      await aboutPage.connectCardEditIcon.click();
      await expect(socialLinksModal.modal).toBeVisible();

      // Get the current form entries using test IDs.
      const allLabelInputs = await socialLinksModal.modal
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
      const deleteButton = socialLinksModal.removeButton(
        socialLinksModal.modal,
        deleteIndex
      );
      await expect(deleteButton).toBeVisible();
      await deleteButton.click();

      // Save the deletion with retry logic.
      const deleteSubmitButton = socialLinksModal.submitButton(
        socialLinksModal.modal
      );
      await expect(deleteSubmitButton).toBeVisible();
      await expect(deleteSubmitButton).toBeEnabled();

      await submitModalWithRetry(
        page,
        socialLinksModal.modal,
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
  }
);
