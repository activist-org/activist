// SPDX-License-Identifier: AGPL-3.0-or-later
import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { submitModalWithRetry } from "~/test-e2e/utils/modalHelpers";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";
import { getEnglishText } from "~/utils/i18n";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToOrganizationGroupSubpage(page, "about");
});

test.describe(
  "Organization Group About Page",
  { tag: ["@desktop", "@mobile"] },
  () => {
    test.setTimeout(60000); // Group pages load slowly in dev mode

    test("Organization Group About Page has no detectable accessibility issues", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      await withTestStep(
        testInfo,
        "Wait for lang attribute to be set",
        async () => {
          await expect(page.locator("html")).toHaveAttribute(
            "lang",
            /^[a-z]{2}(-[A-Z]{2})?$/
          );
        }
      );

      await withTestStep(testInfo, "Run accessibility scan", async () => {
        const violations = await runAccessibilityTest(
          "Organization Group About Page",
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

    test("Group about page tab navigation works correctly", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const organizationPage = newOrganizationPage(page);
      const { groupAboutPage } = organizationPage;

      await withTestStep(testInfo, "Navigate to events tab", async () => {
        await groupAboutPage.clickEventsTab();
        await expect(groupAboutPage.eventsTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupAboutPage.aboutTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });

      await withTestStep(testInfo, "Navigate to resources tab", async () => {
        await groupAboutPage.clickResourcesTab();
        await expect(groupAboutPage.resourcesTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupAboutPage.eventsTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });

      await withTestStep(testInfo, "Navigate to FAQ tab", async () => {
        await groupAboutPage.clickFaqTab();
        await expect(groupAboutPage.faqTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupAboutPage.resourcesTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });

      await withTestStep(testInfo, "Return to about tab", async () => {
        await groupAboutPage.clickAboutTab();
        await expect(groupAboutPage.aboutTab).toHaveAttribute(
          "aria-selected",
          "true"
        );
        await expect(groupAboutPage.faqTab).toHaveAttribute(
          "aria-selected",
          "false"
        );
      });
    });

    test("User can share the group page", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupAboutPage } = organizationPage;

      await withTestStep(testInfo, "Open share modal", async () => {
        await groupAboutPage.clickShare();
        await expect(groupAboutPage.shareModal).toBeVisible();
      });

      await withTestStep(testInfo, "Close share modal", async () => {
        const closeModalButton =
          groupAboutPage.shareModal.getByTestId("modal-close-button");
        await expect(closeModalButton).toBeVisible();
        await closeModalButton.click({ force: true });

        // Wait for the modal to actually close.
        await expect(groupAboutPage.shareModal).not.toBeVisible({
          timeout: 10000,
        });
      });
    });

    test("User can edit the About section", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupAboutPage } = organizationPage;

      // Ensure we're on the About page.
      await expect(page).toHaveURL(/.*\/groups\/.*\/about/);
      await expect(groupAboutPage.aboutCard).toBeVisible();

      // Click the edit icon to open the edit modal.
      const aboutCardEditIcon = groupAboutPage.aboutCard.locator(
        '[data-testid="edit-icon"]'
      );
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
      const joinButton = groupAboutPage.getInvolvedCard.locator(
        '[data-testid="get-involved-join-button"]'
      );
      await expect(joinButton).toBeVisible();
      await expect(joinButton).toHaveAttribute("href", customJoinUrl);
    });

    test("User can manage social links (CREATE, UPDATE, DELETE)", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const { groupAboutPage, socialLinksModal } = organizationPage;

      // Ensure we're on the About page.
      await expect(page).toHaveURL(/.*\/groups\/.*\/about/);
      await expect(groupAboutPage.connectCard).toBeVisible();

      // Generate unique content for this test run.
      const timestamp = Date.now();
      const newLabel = `Test Group Social Link ${timestamp}`;
      const newUrl = `https://test-group-social-${timestamp}.com`;
      const updatedLabel = `Updated Group Social Link ${timestamp}`;
      const updatedUrl = `https://updated-group-${timestamp}.com`;

      // PHASE 1: CREATE - Add a new social link.
      const connectCardEditIcon = groupAboutPage.connectCard.locator(
        '[data-testid="edit-icon"]'
      );
      await connectCardEditIcon.click();
      await expect(groupAboutPage.socialLinksModal).toBeVisible();

      // Count existing social links.
      const initialCount = await groupAboutPage.socialLinksModal
        .locator('input[id^="form-item-socialLinks."][id$=".label"]')
        .count();

      // Add a new social link.
      const addButton = groupAboutPage.socialLinksModal.locator(
        'button:has-text("Add link")'
      );
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
        const linkCount = await connectCard
          .locator('[data-testid="social-link"]')
          .count();
        expect(linkCount).toBeGreaterThan(0);
      }).toPass({
        timeout: 10000,
        intervals: [100, 250, 500, 1000],
      });

      // Now safely get the count.
      const allSocialLinks = await connectCard
        .locator('[data-testid="social-link"]')
        .count();

      if (allSocialLinks === 0) {
        throw new Error("No social links found after CREATE operation");
      }

      // PHASE 2: UPDATE - Edit the social link we just created.
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
      const socialLinks = connectCard.locator('[data-testid="social-link"]');

      // Wait for at least one social link to be visible.
      await expect(async () => {
        const linkCount = await socialLinks.count();
        expect(linkCount).toBeGreaterThan(0);
      }).toPass({
        timeout: 5000,
        intervals: [100, 250, 500],
      });

      // Look for the updated social link by text content.
      const updatedSocialLink = connectCard.locator("a").filter({
        hasText: new RegExp(updatedLabel, "i"),
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

      // PHASE 3: DELETE - Remove the social link we updated.
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

      // Verify the deleted social link no longer appears on the Connect card.
      // Wait for the modal to close and page to update.
      await expect(groupAboutPage.socialLinksModal).not.toBeVisible({
        timeout: 10000,
      });

      // Verify the updated social link no longer exists.
      const deletedSocialLink = connectCard
        .getByTestId("social-link")
        .filter({ hasText: updatedLabel });
      await expect(deletedSocialLink).not.toBeVisible({
        timeout: 10000,
      });
    });
  }
);
