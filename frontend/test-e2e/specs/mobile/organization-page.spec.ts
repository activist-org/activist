// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { signInAsAdmin } from "~/test-e2e/actions/authentication";
import { navigateToFirstOrganization } from "~/test-e2e/actions/navigation";
import { newOrganizationPage } from "~/test-e2e/page-objects/OrganizationPage";

test.beforeEach(async ({ page }) => {
  await signInAsAdmin(page);
  await navigateToFirstOrganization(page);
});

test.describe("Organization Page", { tag: "@mobile" }, () => {
  test("User can share the organization page", async ({ page }) => {
    const organizationPage = newOrganizationPage(page);

    await organizationPage.shareButton.click();

    await expect(organizationPage.shareModal).toBeVisible();

    // Close the modal by clicking the close button
    const closeModalButton = organizationPage.closeModalButton(
      organizationPage.shareModal
    );
    await expect(closeModalButton).toBeVisible();
    await closeModalButton.click({ force: true });

    // Expect the modal to not be visible
    await expect(organizationPage.shareModal).not.toBeVisible();
  });

  test("User can navigate through organization sections on mobile", async ({
    page,
  }) => {
    const organizationPage = newOrganizationPage(page);
    await expect(page).toHaveURL(/.*\/organizations\/.*\/about/);
    await expect(organizationPage.shareButton).toBeVisible();
    await organizationPage.menu.toggleOpenButton.click();

    // Navigate to About section using existing component object
    await organizationPage.menu.aboutOption.click();
    await expect(organizationPage.aboutPage.getInvolvedCard).toBeVisible();

    await organizationPage.menu.toggleOpenButton.click();

    // Navigate to Events section
    await organizationPage.menu.eventsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/events/);
    await expect(organizationPage.eventsPage.newEventButton).toBeVisible();
    await expect(organizationPage.eventsPage.subscribeButton).toBeVisible();

    await organizationPage.menu.toggleOpenButton.click();

    // Navigate to Resources section
    await organizationPage.menu.resourcesOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/resources/);

    await organizationPage.menu.toggleOpenButton.click();

    // Navigate to FAQ section
    await organizationPage.menu.questionsOption.click();
    await expect(page).toHaveURL(/.*\/organizations\/.*\/faq/);
  });

  test("User can edit the About section on mobile", async ({ page }) => {
    const organizationPage = newOrganizationPage(page);

    // Ensure we're on the About page
    await expect(page).toHaveURL(/.*\/organizations\/.*\/about/);
    await expect(organizationPage.aboutPage.aboutCard).toBeVisible();

    // Click the edit icon to open the edit modal
    await expect(organizationPage.aboutPage.editAboutIcon).toBeVisible();
    await organizationPage.aboutPage.editAboutIcon.click();

    // Verify the edit modal appears
    await expect(organizationPage.editModal).toBeVisible();

    // Verify the form and its fields are present
    const editForm = organizationPage.editModalForm(organizationPage.editModal);
    await expect(editForm).toBeVisible();

    // Verify specific editable text fields
    const descriptionField = organizationPage.editModalDescriptionField(
      organizationPage.editModal
    );
    const getInvolvedField = organizationPage.editModalGetInvolvedField(
      organizationPage.editModal
    );
    const joinUrlField = organizationPage.editModalJoinUrlField(
      organizationPage.editModal
    );

    await expect(descriptionField).toBeVisible();
    await expect(descriptionField).toBeEditable();
    await expect(getInvolvedField).toBeVisible();
    await expect(getInvolvedField).toBeEditable();
    await expect(joinUrlField).toBeVisible();
    await expect(joinUrlField).toBeEditable();

    // Generate unique content for this mobile test run
    const timestamp = Date.now();
    const customDescription = `Mobile test description updated at ${timestamp}`;
    const customGetInvolved = `Join our mobile movement - Test run ${timestamp}`;
    const customJoinUrl = `https://mobile.activist.org/join?run=${timestamp}`;

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
    const submitButton = organizationPage.editModalSubmitButton(
      organizationPage.editModal
    );
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText("Update texts");
    await submitButton.click();

    // Wait for the modal to close after successful save
    await expect(organizationPage.editModal).not.toBeVisible();

    // Verify the changes are reflected on the page
    // The description should be visible in the about card
    const aboutCard = organizationPage.aboutPage.aboutCard;
    await expect(aboutCard).toContainText(customDescription);

    // The get involved text should be visible in the get involved card
    const getInvolvedText = organizationPage.aboutPage.getInvolvedText;
    await expect(getInvolvedText).toContainText(customGetInvolved);

    // Wait for page to update after form submission
    await page.waitForTimeout(1000);

    // Verify the join button URL was updated
    const joinButton = organizationPage.aboutPage.getInvolvedJoinButton;
    await expect(joinButton).toBeVisible();
    await expect(joinButton).toHaveAttribute("href", customJoinUrl);
  });
});
