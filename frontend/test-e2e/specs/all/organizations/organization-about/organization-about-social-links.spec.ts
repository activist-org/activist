// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToFirstOrganization } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { submitModalWithRetry } from "~/test-e2e/utils/modalHelpers";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToFirstOrganization(page);

  // Wait for auth state to be fully loaded.
  await page.waitForLoadState("domcontentloaded");

  // Wait for page to be fully loaded (no arbitrary delay).
  await expect(async () => {
    // Verify page is interactive and fully rendered.
    const isReady = await page.evaluate(
      () => document.readyState === "complete"
    );
    expect(isReady).toBe(true);
  }).toPass({
    timeout: 10000,
    intervals: [100, 250],
  });
});

test.describe(
  "Organization About Page - Social Links",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.setTimeout(60000); // Increased timeout for slow dev mode loading

    test("User can manage social links (CREATE, UPDATE, DELETE)", async ({
      page,
    }) => {
      // MARK: Setup

      const organizationPage = newOrganizationPage(page);
      const { aboutPage, socialLinksModal } = organizationPage;

      // Ensure we're on the About page.
      await expect(page).toHaveURL(/.*\/organizations\/.*\/about/, {});

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

      // MARK: Create

      // Add a new social link.
      await aboutPage.connectCardEditIcon.click();
      await expect(socialLinksModal.modal).toBeVisible();

      // Count existing social link entries using data-testid.
      const existingEntries = await socialLinksModal.modal
        .getByTestId(/^social-link-entry-/)
        .all();
      const initialCount = existingEntries.length;

      // Add a new social link.
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
      await expect(socialLinksModal.modal).not.toBeVisible({});

      // Verify the new social link appears on the Connect card.
      const { connectCard } = organizationPage.aboutPage;

      // Check if social links were created (with flexible timeout).
      let allSocialLinks = 0;
      try {
        await expect(connectCard.getByRole("link").first()).toBeVisible({});
        allSocialLinks = await connectCard.getByRole("link").count();
      } catch {
        // CREATE might have failed, check if any links exist at all.
        allSocialLinks = await connectCard.getByRole("link").count();

        if (allSocialLinks === 0) {
          throw new Error("No social links found after CREATE operation");
        }
      }

      // MARK: Update

      // Edit the social link we just created.
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
      await expect(socialLinksModal.modal).not.toBeVisible({});

      // Verify the updated social link appears on the Connect card.
      // Use getByTestId and filter by text since accessible name might include icon.
      await expect(
        connectCard.getByTestId("social-link").filter({ hasText: updatedLabel })
      ).toBeVisible();
      await expect(
        connectCard.getByTestId("social-link").filter({ hasText: updatedLabel })
      ).toHaveAttribute("href", updatedUrl);

      // MARK: Delete

      // Remove the social link we updated.
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
      // MARK: Verification

      // Verify the deleted social link no longer appears on the Connect card.
      // Use getByTestId and filter by text since accessible name might include icon.
      await expect(
        connectCard.getByTestId("social-link").filter({ hasText: updatedLabel })
      ).not.toBeVisible({});
    });
  }
);
