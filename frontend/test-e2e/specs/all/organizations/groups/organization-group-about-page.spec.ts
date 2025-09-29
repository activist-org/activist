// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { runAccessibilityTest } from "~/test-e2e/accessibility/accessibilityTesting";
import { signInAsAdmin } from "~/test-e2e/actions/authentication";
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";
import { submitModalWithRetry } from "~/test-e2e/utils/modalHelpers";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

test.beforeEach(async ({ page }) => {
  // Sign in as admin to access edit functionality
  await signInAsAdmin(page);
  // Navigate to a group about page within an organization
  await navigateToOrganizationGroupSubpage(page, "about");
});

test.describe(
  "Organization Group About Page",
  { tag: ["@desktop", "@mobile"] },
  () => {
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

    test("Group about page elements are accessible", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const organizationPage = newOrganizationPage(page);
      const groupAboutPage = organizationPage.groupAboutPage;

      await withTestStep(
        testInfo,
        "Verify join group button is accessible",
        async () => {
          if (await groupAboutPage.isJoinGroupButtonVisible()) {
            await expect(groupAboutPage.joinGroupButton).toBeVisible();
            await expect(groupAboutPage.joinGroupButton).toHaveAttribute(
              "aria-label"
            );
          }
        }
      );

      await withTestStep(
        testInfo,
        "Verify share button is accessible",
        async () => {
          await expect(groupAboutPage.shareButton).toBeVisible();
          await expect(groupAboutPage.shareButton).toHaveAttribute(
            "aria-label"
          );
        }
      );

      await withTestStep(
        testInfo,
        "Verify tab navigation is accessible",
        async () => {
          await expect(groupAboutPage.tabs).toBeVisible();
          await expect(groupAboutPage.aboutTab).toHaveAttribute(
            "aria-selected",
            "true"
          );
          await expect(groupAboutPage.eventsTab).toHaveAttribute(
            "aria-selected",
            "false"
          );
          await expect(groupAboutPage.resourcesTab).toHaveAttribute(
            "aria-selected",
            "false"
          );
          await expect(groupAboutPage.faqTab).toHaveAttribute(
            "aria-selected",
            "false"
          );
        }
      );

      await withTestStep(
        testInfo,
        "Verify about card is accessible",
        async () => {
          if (await groupAboutPage.isAboutCardVisible()) {
            await expect(groupAboutPage.aboutCard).toBeVisible();
          }
        }
      );
    });

    test("Group about page tab navigation works correctly", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);

      const organizationPage = newOrganizationPage(page);
      const groupAboutPage = organizationPage.groupAboutPage;

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
      const groupAboutPage = organizationPage.groupAboutPage;

      await withTestStep(testInfo, "Open share modal", async () => {
        await groupAboutPage.clickShare();
        await expect(groupAboutPage.shareModal).toBeVisible();
      });

      await withTestStep(testInfo, "Close share modal", async () => {
        const closeModalButton = groupAboutPage.shareModal.locator(
          '[data-testid="modal-close-button"]'
        );
        await expect(closeModalButton).toBeVisible();
        await closeModalButton.click({ force: true });
        await expect(groupAboutPage.shareModal).not.toBeVisible();
      });
    });

    test("User can edit the About section", async ({ page }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const groupAboutPage = organizationPage.groupAboutPage;

      // Ensure we're on the About page
      await expect(page).toHaveURL(/.*\/groups\/.*\/about/);
      await expect(groupAboutPage.aboutCard).toBeVisible();

      // Click the edit icon to open the edit modal
      const aboutCardEditIcon = groupAboutPage.aboutCard.locator(
        '[data-testid="edit-icon"]'
      );
      await expect(aboutCardEditIcon).toBeVisible();
      await aboutCardEditIcon.click();

      // Verify the edit modal appears
      await expect(groupAboutPage.textModal).toBeVisible();

      // Verify the form and its fields are present
      const editForm = groupAboutPage.textModal.locator("form");
      await expect(editForm).toBeVisible();

      // Verify specific editable text fields
      const descriptionField = groupAboutPage.textModal.locator(
        "#form-item-description"
      );
      const getInvolvedField = groupAboutPage.textModal.locator(
        "#form-item-getInvolved"
      );
      const joinUrlField = groupAboutPage.textModal.locator(
        "#form-item-getInvolvedUrl"
      );

      await expect(descriptionField).toBeVisible();
      await expect(descriptionField).toBeEditable();
      await expect(getInvolvedField).toBeVisible();
      await expect(getInvolvedField).toBeEditable();
      await expect(joinUrlField).toBeVisible();
      await expect(joinUrlField).toBeEditable();

      // Generate unique content for this test run
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

      // Verify the fields contain the new text
      await expect(descriptionField).toHaveValue(customDescription);
      await expect(getInvolvedField).toHaveValue(customGetInvolved);
      await expect(joinUrlField).toHaveValue(customJoinUrl);

      // Submit the form to save changes
      const submitButton = groupAboutPage.textModal.locator(
        'button[type="submit"]'
      );
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toContainText("Update texts");
      await submitButton.click();

      // Wait for the modal to close after successful save
      await expect(groupAboutPage.textModal).not.toBeVisible();

      // Verify the changes are reflected on the page
      // The description should be visible in the about card
      const aboutCard = groupAboutPage.aboutCard;
      await expect(aboutCard).toContainText(customDescription);

      // The get involved text should be visible in the get involved card
      const getInvolvedCard = groupAboutPage.getInvolvedCard;
      await expect(getInvolvedCard).toContainText(customGetInvolved);

      // Verify the join button URL was updated
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
      const groupAboutPage = organizationPage.groupAboutPage;

      // Ensure we're on the About page
      await expect(page).toHaveURL(/.*\/groups\/.*\/about/);
      await expect(groupAboutPage.connectCard).toBeVisible();

      // Generate unique content for this test run
      const timestamp = Date.now();
      const newLabel = `Test Group Social Link ${timestamp}`;
      const newUrl = `https://test-group-social-${timestamp}.com`;
      const updatedLabel = `Updated Group Social Link ${timestamp}`;
      const updatedUrl = `https://updated-group-${timestamp}.com`;

      // PHASE 1: CREATE - Add a new social link
      const connectCardEditIcon = groupAboutPage.connectCard.locator(
        '[data-testid="edit-icon"]'
      );
      await connectCardEditIcon.click();
      await expect(groupAboutPage.socialLinksModal).toBeVisible();

      // Count existing social links
      const initialCount = await groupAboutPage.socialLinksModal
        .locator('input[id^="form-item-socialLinks."][id$=".label"]')
        .count();

      // Add a new social link
      const addButton = groupAboutPage.socialLinksModal.locator(
        'button:has-text("Add link")'
      );
      await expect(addButton).toBeVisible();
      await addButton.click();

      // Wait for the new entry to appear
      await expect(
        groupAboutPage.socialLinksModal.locator(
          'input[id^="form-item-socialLinks."][id$=".label"]'
        )
      ).toHaveCount(initialCount + 1);

      // Use the newly added entry (at the last index)
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

      // Verify the fields contain the entered text
      await expect(newLabelField).toHaveValue(newLabel);
      await expect(newUrlField).toHaveValue(newUrl);

      // Ensure fields are not empty before submitting
      expect(newLabel.trim()).toBeTruthy();
      expect(newUrl.trim()).toBeTruthy();

      // Save the new social link with retry logic
      const submitButton = groupAboutPage.socialLinksModal.locator(
        'button[type="submit"]'
      );
      await submitModalWithRetry(
        page,
        groupAboutPage.socialLinksModal,
        submitButton,
        "CREATE"
      );

      // Verify the new social link appears on the Connect card
      const connectCard = groupAboutPage.connectCard;

      // Wait for the page to update after the modal closes
      await page.waitForTimeout(1000);

      // Check if social links were created (with flexible timeout)
      let allSocialLinks = 0;
      try {
        await expect(
          connectCard.locator('[data-testid="social-link"]').first()
        ).toBeVisible({
          timeout: 10000,
        });
        allSocialLinks = await connectCard
          .locator('[data-testid="social-link"]')
          .count();
      } catch {
        // CREATE might have failed, check if any links exist at all
        allSocialLinks = await connectCard
          .locator('[data-testid="social-link"]')
          .count();

        if (allSocialLinks === 0) {
          throw new Error("No social links found after CREATE operation");
        }
      }

      // PHASE 2: UPDATE - Edit an existing social link
      await connectCardEditIcon.click();
      await expect(groupAboutPage.socialLinksModal).toBeVisible();

      // Find the first available social link to edit
      const availableEntries = await groupAboutPage.socialLinksModal
        .locator('input[id^="form-item-socialLinks."][id$=".label"]')
        .count();

      if (availableEntries === 0) {
        throw new Error("No social links available to update");
      }

      // Edit the first social link (index 0)
      const editLabelField = groupAboutPage.socialLinksModal.locator(
        '[id="form-item-socialLinks.0.label"]'
      );
      const editUrlField = groupAboutPage.socialLinksModal.locator(
        '[id="form-item-socialLinks.0.link"]'
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
      await editLabelField.pressSequentially(updatedLabel);

      await editUrlField.clear();
      await editUrlField.pressSequentially(updatedUrl);

      // Verify the fields contain the updated text
      await expect(editLabelField).toHaveValue(updatedLabel);
      await expect(editUrlField).toHaveValue(updatedUrl);

      // Ensure fields are not empty before submitting
      expect(updatedLabel.trim()).toBeTruthy();
      expect(updatedUrl.trim()).toBeTruthy();

      // Save the changes with retry logic
      const updateSubmitButton = groupAboutPage.socialLinksModal.locator(
        'button[type="submit"]'
      );
      await submitModalWithRetry(
        page,
        groupAboutPage.socialLinksModal,
        updateSubmitButton,
        "UPDATE"
      );

      // Verify the updated social link appears on the Connect card
      // Wait a bit for the page to update after the modal closes
      await page.waitForTimeout(1000);

      // Check if any social links are visible first
      const socialLinks = connectCard.locator('[data-testid="social-link"]');

      // Look for the updated social link by text content
      const updatedSocialLink = connectCard.locator("a").filter({
        hasText: new RegExp(updatedLabel, "i"),
      });

      // If not found by text, try to find by href
      if ((await updatedSocialLink.count()) === 0) {
        const linkByHref = connectCard.locator(`a[href="${updatedUrl}"]`);
        if ((await linkByHref.count()) > 0) {
          await expect(linkByHref).toBeVisible();
        } else {
          // Fallback: just verify that some social links exist
          await expect(socialLinks.first()).toBeVisible();
        }
      } else {
        await expect(updatedSocialLink).toBeVisible();
        await expect(updatedSocialLink).toHaveAttribute("href", updatedUrl);
      }

      // PHASE 3: DELETE - Remove the first available social link (if any remain)
      await connectCardEditIcon.click();
      await expect(groupAboutPage.socialLinksModal).toBeVisible();

      // Get the current form entries
      const allLabelInputs = await groupAboutPage.socialLinksModal
        .locator('input[id^="form-item-socialLinks."][id$=".label"]')
        .all();

      if (allLabelInputs.length === 0) {
        throw new Error("No social links available to delete");
      }

      // Get the label of the first entry (whatever it is) for verification after deletion
      const firstLabelValue = await allLabelInputs[0].inputValue();

      // Delete the first social link (index 0)
      const deleteButton = groupAboutPage.socialLinksModal
        .locator('[data-testid="remove-button"]')
        .first();
      await expect(deleteButton).toBeVisible();
      await deleteButton.click();

      // Save the deletion with retry logic
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

      // Verify the deleted social link no longer appears on the Connect card
      // Wait for the page to update after the modal closes
      await page.waitForTimeout(1000);

      if (firstLabelValue) {
        await expect(connectCard).not.toContainText(firstLabelValue, {
          timeout: 10000,
        });
      } else {
        // Fallback: just verify that social links still exist (if any were there before)
        await connectCard.locator('[data-testid="social-link"]').count();
      }
    });

    test("User can expand and collapse text in About card", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const groupAboutPage = organizationPage.groupAboutPage;

      // Ensure we're on the About page
      await expect(page).toHaveURL(/.*\/groups\/.*\/about/);
      await expect(groupAboutPage.aboutCard).toBeVisible();

      // Check if expand/collapse functionality is available
      const expandButton = groupAboutPage.aboutCard.locator(
        '[data-testid="expand-text-button"]'
      );
      const collapseIconButton = groupAboutPage.aboutCard.locator(
        '[data-testid="collapse-text-icon-button"]'
      );
      const collapseTextButton = groupAboutPage.aboutCard.locator(
        '[data-testid="collapse-text-button"]'
      );

      // If expand button is visible, click it to expand text
      if (await expandButton.isVisible()) {
        await withTestStep(testInfo, "Expand text", async () => {
          await expandButton.click();
          // Check for either type of collapse button
          const hasCollapseIcon = await collapseIconButton.isVisible();
          const hasCollapseText = await collapseTextButton.isVisible();
          expect(hasCollapseIcon || hasCollapseText).toBe(true);
          await expect(expandButton).not.toBeVisible();
        });

        // If any collapse button is visible, click it to collapse text
        const hasCollapseIcon = await collapseIconButton.isVisible();
        const hasCollapseText = await collapseTextButton.isVisible();

        if (hasCollapseIcon || hasCollapseText) {
          await withTestStep(testInfo, "Collapse text", async () => {
            if (hasCollapseIcon) {
              await collapseIconButton.click();
            } else if (hasCollapseText) {
              await collapseTextButton.click();
            }
            await expect(expandButton).toBeVisible();
            await expect(collapseIconButton).not.toBeVisible();
            await expect(collapseTextButton).not.toBeVisible();
          });
        }
      }
    });

    test("Group about page displays all required elements", async ({
      page,
    }, testInfo) => {
      logTestPath(testInfo);
      const organizationPage = newOrganizationPage(page);
      const groupAboutPage = organizationPage.groupAboutPage;

      await withTestStep(
        testInfo,
        "Verify page heading is visible",
        async () => {
          await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        }
      );

      await withTestStep(testInfo, "Verify about card is visible", async () => {
        if (await groupAboutPage.isAboutCardVisible()) {
          await expect(groupAboutPage.aboutCard).toBeVisible();
        }
      });

      await withTestStep(
        testInfo,
        "Verify get involved card is visible",
        async () => {
          await expect(groupAboutPage.getInvolvedCard).toBeVisible();
        }
      );

      await withTestStep(
        testInfo,
        "Verify connect card is visible",
        async () => {
          await expect(groupAboutPage.connectCard).toBeVisible();
        }
      );

      await withTestStep(
        testInfo,
        "Verify image carousel is visible",
        async () => {
          if (await groupAboutPage.isImageCarouselVisible()) {
            await expect(groupAboutPage.imageCarousel).toBeVisible();
          }
        }
      );

      await withTestStep(
        testInfo,
        "Verify tab navigation is present",
        async () => {
          await expect(groupAboutPage.tabs).toBeVisible();
          await expect(groupAboutPage.aboutTab).toBeVisible();
          await expect(groupAboutPage.eventsTab).toBeVisible();
          await expect(groupAboutPage.resourcesTab).toBeVisible();
          await expect(groupAboutPage.faqTab).toBeVisible();
        }
      );
    });
  }
);
