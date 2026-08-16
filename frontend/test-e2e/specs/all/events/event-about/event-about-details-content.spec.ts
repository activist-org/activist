// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "#shared/utils/i18n";
import { navigateToEventSubpage } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";

test.beforeEach(async ({ page }) => {
  await navigateToEventSubpage(page, "about");
  await page.waitForLoadState("domcontentloaded");

  await expect(async () => {
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
  "Event About Page - Details Card Content",
  { tag: ["@desktop"] },
  () => {
    test.setTimeout(60000);

    test("User can open and close the Details edit modal", async ({ page }) => {
      const eventPage = newEventPage(page);
      const { aboutPage, detailsEditModal } = eventPage;

      await expect(page).toHaveURL(/.*\/events\/.*\/about/);
      await expect(aboutPage.detailsCardHeading).toBeVisible({
        timeout: 15000,
      });
      await expect(aboutPage.detailsCardEditIcon).toBeVisible();

      await aboutPage.detailsCardEditIcon.click();

      await expect(detailsEditModal.root).toBeVisible();
      await expect(detailsEditModal.heading).toBeVisible();
      await expect(detailsEditModal.form).toBeVisible();
      await expect(detailsEditModal.orgsCombobox).toBeVisible();
      await expect(detailsEditModal.locationTypeSection).toBeVisible();
      await expect(detailsEditModal.scheduleCalendar).toBeVisible();
      await expect(detailsEditModal.timesSection).toBeVisible();

      await expect(detailsEditModal.closeButton).toBeVisible();
      await detailsEditModal.closeButton.click({ force: true });
      await expect(detailsEditModal.root).not.toBeVisible();
    });

    test("Details edit modal shows online link field when location type is online", async ({
      page,
    }) => {
      const eventPage = newEventPage(page);
      const { aboutPage, detailsEditModal } = eventPage;

      await expect(aboutPage.detailsCardEditIcon).toBeVisible({
        timeout: 15000,
      });
      await aboutPage.detailsCardEditIcon.click();
      await expect(detailsEditModal.root).toBeVisible();

      await detailsEditModal.locationTypeSection
        .getByRole("radio", {
          name: new RegExp(
            getEnglishText("i18n.components._global.location_type_online"),
            "i"
          ),
        })
        .click();

      await expect(detailsEditModal.onlineLinkField).toBeVisible();

      await detailsEditModal.closeButton.click({ force: true });
      await expect(detailsEditModal.root).not.toBeVisible();
    });
  }
);
