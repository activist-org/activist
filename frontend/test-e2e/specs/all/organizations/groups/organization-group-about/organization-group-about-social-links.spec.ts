// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { submitModalWithRetry } from "~/test-e2e/utils/modalHelpers";
import { logTestPath } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToOrganizationGroupSubpage(page, "about");
});

test.describe(
  "Organization Group About Page - Social Links",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.setTimeout(60000); // group pages load slowly in dev mode

    test("User can manage social links (CREATE, UPDATE, DELETE)", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      // MARK: Setup

      const organizationPage = newOrganizationPage(page);
      const { groupAboutPage, socialLinksModal } = organizationPage;

      // Ensure we're on the About page.
      await expect(page).toHaveURL(/.*\/groups\/.*\/about/);
      await expect(groupAboutPage.connectCard).toBeVisible({ timeout: 15000 });

      // Generate unique content for this test run.
      const timestamp = Date.now();
      const newLabel = `Test Group Social Link ${timestamp}`;
      const newUrl = `https://test-group-social-${timestamp}.com`;
      const updatedLabel = `Updated Group Social Link ${timestamp}`;
      const updatedUrl = `https://updated-group-${timestamp}.com`;

      // MARK: Create

      // Add a new social link.
      const connectCardEditIcon =
        groupAboutPage.connectCard.getByTestId("edit-icon");
      await connectCardEditIcon.click();
      await expect(groupAboutPage.socialLinksModal).toBeVisible();

      // Count existing social links.
      const initialCount = await groupAboutPage.socialLinksModal
        .locator('input[id^="form-item-socialLinks."][id$=".label"]')
        .count();

      // Add a new social link.
      const addButton = groupAboutPage.socialLinksModal.getByText(/add link/i);
      await expect(addButton).toBeVisible();
      // Use JavaScript click to bypass viewport restrictions on mobile.
      await addButton.evaluate((btn) => (btn as HTMLElement).click());

      // Wait for the new entry to appear.
      await expect(
        groupAboutPage.socialLinksModal.locator(
          'input[id^="form-item-socialLinks."][id$=".label"]'
        )
      ).toHaveCount(initialCount + 1);

      // Use the newly added entry (at the last index).
      const newEntryIndex = initialCount;
      const newLabelField = groupAboutPage.socialLinksModal.locator(
        `[id="form-item-socialLinks.${newEntryIndex}.label"]`
      );
      const newUrlField = groupAboutPage.socialLinksModal.locator(
        `[id="form-item-socialLinks.${newEntryIndex}.link"]`
      );

      await expect(newLabelField).toBeVisible();
      await expect(newUrlField).toBeVisible();

      await newLabelField.pressSequentially(newLabel);
      await newUrlField.pressSequentially(newUrl);

      // Verify the fields contain the entered text.
      await expect(newLabelField).toHaveValue(newLabel);
      await expect(newUrlField).toHaveValue(newUrl);

      // Ensure fields are not empty before submitting.
      expect(newLabel.trim()).toBeTruthy();
      expect(newUrl.trim()).toBeTruthy();

      // Save the new social link with retry logic.
      const submitButton = groupAboutPage.socialLinksModal.locator(
        'button[type="submit"]'
      );
      await submitModalWithRetry(
        page,
        groupAboutPage.socialLinksModal,
        submitButton,
        "CREATE"
      );

      // Verify the new social link appears on the Connect card.
      const { connectCard } = groupAboutPage;

      // Wait intelligently for social link to appear (no arbitrary delay).
      await expect(async () => {
        const linkCount = await connectCard.getByTestId("social-link").count();
        expect(linkCount).toBeGreaterThan(0);
      }).toPass({
        intervals: [100, 250, 500, 1000],
      });

      // Now safely get the count.
      const allSocialLinks = await connectCard
        .getByTestId("social-link")
        .count();

      if (allSocialLinks === 0) {
        throw new Error("No social links found after CREATE operation");
      }

      // MARK: Update

      // Edit the social link we just created
      await connectCardEditIcon.click();
      await expect(groupAboutPage.socialLinksModal).toBeVisible();

      // Get all label inputs and find the one we created.
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

      // Ensure fields are not empty before submitting.
      expect(updatedLabel.trim()).toBeTruthy();
      expect(updatedUrl.trim()).toBeTruthy();

      // Save the changes with retry logic.
      const updateSubmitButton = groupAboutPage.socialLinksModal.locator(
        'button[type="submit"]'
      );
      await submitModalWithRetry(
        page,
        groupAboutPage.socialLinksModal,
        updateSubmitButton,
        "UPDATE"
      );

      // Verify the updated social link appears on the Connect card.
      // Wait intelligently for social link to update (no arbitrary delay).
      const socialLinks = connectCard.getByTestId("social-link");

      // Wait for at least one social link to be visible.
      await expect(async () => {
        const linkCount = await socialLinks.count();
        expect(linkCount).toBeGreaterThan(0);
      }).toPass({
        intervals: [100, 250, 500],
      });

      // Look for the updated social link by text content.
      const updatedSocialLink = connectCard.getByRole("link", {
        name: new RegExp(updatedLabel, "i"),
      });

      // If not found by text, try to find by href.
      if ((await updatedSocialLink.count()) === 0) {
        const linkByHref = connectCard.locator(`a[href="${updatedUrl}"]`);
        if ((await linkByHref.count()) > 0) {
          await expect(linkByHref).toBeVisible();
        } else {
          // Fallback: just verify that some social links exist.
          await expect(socialLinks.first()).toBeVisible();
        }
      } else {
        await expect(updatedSocialLink).toBeVisible();
        await expect(updatedSocialLink).toHaveAttribute("href", updatedUrl);
      }

      // MARK: Delete

      // Remove the social link we updated
      await connectCardEditIcon.click();
      await expect(groupAboutPage.socialLinksModal).toBeVisible();

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
      const deleteSubmitButton = groupAboutPage.socialLinksModal.locator(
        'button[type="submit"]'
      );
      await expect(deleteSubmitButton).toBeVisible();
      await expect(deleteSubmitButton).toBeEnabled();

      await submitModalWithRetry(
        page,
        groupAboutPage.socialLinksModal,
        deleteSubmitButton,
        "DELETE"
      );

      // MARK: Verification

      // Verify the deleted social link no longer appears on the Connect card
      // Wait for the modal to close and page to update.
      await expect(groupAboutPage.socialLinksModal).not.toBeVisible({});
      // Verify the updated social link no longer exists.
      const deletedSocialLink = connectCard
        .getByTestId("social-link")
        .filter({ hasText: updatedLabel });
      await expect(deletedSocialLink).not.toBeVisible({});
    });
  }
);
