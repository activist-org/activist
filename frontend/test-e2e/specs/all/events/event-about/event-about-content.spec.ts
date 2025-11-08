// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToEventSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";
import { getEnglishText } from "~/utils/i18n";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToEventSubpage(page, "about");

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
  "Event About Page - Content Editing",
  { tag: ["@desktop"] },
  () => {
    test.setTimeout(60000); // increased timeout for slow dev mode loading

    test("User can edit the About section", async ({ page }) => {
      const eventPage = newEventPage(page);
      const { aboutPage, editModal } = eventPage;

      // Ensure we're on the About page.
      await expect(page).toHaveURL(/.*\/events\/.*\/about/, {});

      // Wait for page to be ready.
      await page.waitForLoadState("domcontentloaded");

      // Wait for the about card to be visible.
      await expect(aboutPage.aboutCard).toBeVisible({
        timeout: 15000,
      });

      // Wait for edit icon to be available (auth state should be loaded).
      await expect(aboutPage.aboutCardEditIcon).toBeVisible({});

      // Click the edit icon to open the edit modal.
      await aboutPage.aboutCardEditIcon.click();

      // Verify the edit modal appears.
      await expect(editModal.modal).toBeVisible();

      // Verify the form and its fields are present.
      const editForm = editModal.form(editModal.modal);
      await expect(editForm).toBeVisible();

      // Verify specific editable text fields.
      const descriptionField = editModal.descriptionField(editModal.modal);
      await expect(descriptionField).toBeVisible();

      // Close the modal.
      const closeButton = editModal.modal.getByTestId("modal-close-button");
      await expect(closeButton).toBeVisible();
      await closeButton.click({ force: true });

      // Verify modal is closed.
      await expect(editModal.modal).not.toBeVisible();
    });

    test("User can edit the Get Involved section", async ({ page }) => {
      const eventPage = newEventPage(page);
      const { aboutPage, editModal } = eventPage;

      // Wait for the get involved card to be visible.
      await expect(aboutPage.getInvolvedCard).toBeVisible({
        timeout: 15000,
      });

      // Click the edit icon on Get Involved card.
      await aboutPage.getInvolvedCardEditIcon.click();

      // Verify the edit modal appears.
      await expect(editModal.modal).toBeVisible();

      // Verify the form fields are present.
      const editForm = editModal.form(editModal.modal);
      await expect(editForm).toBeVisible();

      // Close the modal.
      const closeButton = editModal.modal.getByTestId("modal-close-button");
      await expect(closeButton).toBeVisible();
      await closeButton.click({ force: true });

      // Verify modal is closed.
      await expect(editModal.modal).not.toBeVisible();
    });

    test("User can expand and collapse About text", async ({ page }) => {
      const eventPage = newEventPage(page);
      const { aboutPage } = eventPage;

      // Wait for about card to be visible.
      await expect(aboutPage.aboutCard).toBeVisible({
        timeout: 15000,
      });

      // Check if expand button exists (only if text is long enough).
      const expandButton = page.getByRole("button", {
        name: new RegExp(
          getEnglishText(
            "i18n.components.card.about._global.full_text_aria_label"
          ),
          "i"
        ),
      });
      const expandButtonVisible = await expandButton
        .isVisible()
        .catch(() => false);

      if (expandButtonVisible) {
        // Click expand button.
        await expandButton.click();

        // Verify collapse button is now visible.
        const collapseButton = page.getByRole("button", {
          name: new RegExp(
            getEnglishText(
              "i18n.components.card.about._global.reduce_text_aria_label"
            ),
            "i"
          ),
        });
        await expect(collapseButton).toBeVisible();

        // Click collapse button.
        await collapseButton.click();
        // Verify expand button is visible again.
        await expect(expandButton).toBeVisible();
      } else {
        // Skip test if text is not long enough to require expansion.
        test.skip(
          expandButtonVisible,
          "About text is not long enough to test expand/collapse"
        );
      }
    });
  }
);
