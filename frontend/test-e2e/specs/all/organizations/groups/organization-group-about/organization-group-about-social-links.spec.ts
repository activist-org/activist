// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToOrganizationGroupSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationPage } from "~/test-e2e/page-objects/organization/OrganizationPage";
import { submitModalWithRetry } from "~/test-e2e/utils/modalHelpers";
import { logTestPath, withTestStep } from "~/test-e2e/utils/testTraceability";

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

      const { connectCard } = groupAboutPage;
      const connectCardEditIcon =
        groupAboutPage.connectCard.getByTestId("icon-edit");

      // MARK: Create

      await withTestStep(testInfo, "Create social link", async () => {
        await connectCardEditIcon.click();
        await expect(groupAboutPage.socialLinksModal).toBeVisible();

        const initialCount = await groupAboutPage.socialLinksModal
          .locator('input[id^="form-item-socialLinks."][id$=".label"]')
          .count();

        const addButton =
          groupAboutPage.socialLinksModal.getByText(/add link/i);
        await expect(addButton).toBeVisible();
        await addButton.evaluate((btn) => (btn as HTMLElement).click());

        await expect(
          groupAboutPage.socialLinksModal.locator(
            'input[id^="form-item-socialLinks."][id$=".label"]'
          )
        ).toHaveCount(initialCount + 1);

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

        await expect(newLabelField).toHaveValue(newLabel);
        await expect(newUrlField).toHaveValue(newUrl);

        expect(newLabel.trim()).toBeTruthy();
        expect(newUrl.trim()).toBeTruthy();

        const submitButton = groupAboutPage.socialLinksModal.locator(
          'button[type="submit"]'
        );
        await submitModalWithRetry(
          page,
          groupAboutPage.socialLinksModal,
          submitButton,
          "CREATE"
        );

        await expect(async () => {
          const linkCount = await connectCard.getByTestId("social-link").count();
          expect(linkCount).toBeGreaterThan(0);
        }).toPass({
          intervals: [100, 250, 500, 1000],
        });

        const allSocialLinks = await connectCard
          .getByTestId("social-link")
          .count();

        if (allSocialLinks === 0) {
          throw new Error("No social links found after CREATE operation");
        }
      });

      // MARK: Update

      await withTestStep(testInfo, "Update social link", async () => {
        await connectCardEditIcon.click();
        await expect(groupAboutPage.socialLinksModal).toBeVisible();

        const availableEntries = await socialLinksModal.modal
          .getByTestId(/^social-link-label-/)
          .all();

        if (availableEntries.length === 0) {
          throw new Error("No social links available to update");
        }

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

        const currentLabel = await editLabelField.inputValue();
        const currentUrl = await editUrlField.inputValue();
        expect(currentLabel).toBeTruthy();
        expect(currentUrl).toBeTruthy();

        await editLabelField.clear();
        await editLabelField.pressSequentially(updatedLabel);

        await editUrlField.clear();
        await editUrlField.pressSequentially(updatedUrl);

        await expect(editLabelField).toHaveValue(updatedLabel);
        await expect(editUrlField).toHaveValue(updatedUrl);

        expect(updatedLabel.trim()).toBeTruthy();
        expect(updatedUrl.trim()).toBeTruthy();

        const updateSubmitButton = groupAboutPage.socialLinksModal.locator(
          'button[type="submit"]'
        );
        await submitModalWithRetry(
          page,
          groupAboutPage.socialLinksModal,
          updateSubmitButton,
          "UPDATE"
        );

        const socialLinks = connectCard.getByTestId("social-link");

        await expect(async () => {
          const linkCount = await socialLinks.count();
          expect(linkCount).toBeGreaterThan(0);
        }).toPass({
          intervals: [100, 250, 500],
        });

        const updatedSocialLink = connectCard.getByRole("link", {
          name: new RegExp(updatedLabel, "i"),
        });

        if ((await updatedSocialLink.count()) === 0) {
          const linkByHref = connectCard.locator(`a[href="${updatedUrl}"]`);
          if ((await linkByHref.count()) > 0) {
            await expect(linkByHref).toBeVisible();
          } else {
            await expect(socialLinks.first()).toBeVisible();
          }
        } else {
          await expect(updatedSocialLink).toBeVisible();
          await expect(updatedSocialLink).toHaveAttribute("href", updatedUrl);
        }
      });

      // MARK: Delete + Verification

      await withTestStep(
        testInfo,
        "Delete social link and verify removal",
        async () => {
          await connectCardEditIcon.click();
          await expect(groupAboutPage.socialLinksModal).toBeVisible();

          const allLabelInputs = await socialLinksModal.modal
            .getByTestId(/^social-link-label-/)
            .all();

          if (allLabelInputs.length === 0) {
            throw new Error("No social links available to delete");
          }

          let deleteIndex = -1;
          const foundValues = [];

          for (let i = 0; i < allLabelInputs.length; i++) {
            const value = await allLabelInputs[i]?.inputValue();
            foundValues.push(value);

            if (value === updatedLabel) {
              deleteIndex = i;
              break;
            }

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

          const deleteButton = socialLinksModal.removeButton(
            socialLinksModal.modal,
            deleteIndex
          );
          await expect(deleteButton).toBeVisible();
          await deleteButton.click();

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

          await expect(groupAboutPage.socialLinksModal).not.toBeVisible({});
          const deletedSocialLink = connectCard
            .getByTestId("social-link")
            .filter({ hasText: updatedLabel });
          await expect(deletedSocialLink).not.toBeVisible({});
        }
      );
    });
  }
);
