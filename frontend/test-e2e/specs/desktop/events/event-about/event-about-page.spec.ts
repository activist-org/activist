// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToFirstEvent } from "~/test-e2e/actions/navigation";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToFirstEvent(page);
});

test.describe("Event About Page", { tag: "@desktop" }, () => {
  test("User can navigate through event sections on desktop", async ({
    page,
  }) => {
    const eventPage = newEventPage(page);
    const { aboutPage } = eventPage;

    // Ensure sidebar is open for navigation.
    await eventPage.sidebar.open();

    // Verify we start on the About page (desktop auto-redirects to /about).
    await expect(page).toHaveURL(/.*\/events\/.*\/about/, {});
    await page.waitForLoadState("domcontentloaded");

    // Event pages load slowly in dev mode.
    await expect(aboutPage.aboutCard).toBeVisible({
      timeout: 15000,
    });
    await expect(aboutPage.getInvolvedCard).toBeVisible({
      timeout: 15000,
    });
    await expect(aboutPage.connectCard).toBeVisible({
      timeout: 15000,
    });

    // Navigate to Resources section.
    await eventPage.menu.resourcesOption.click();
    await expect(page).toHaveURL(/.*\/events\/.*\/resources/);

    // Navigate to FAQ section.
    await eventPage.menu.questionsOption.click();
    await expect(page).toHaveURL(/.*\/events\/.*\/faq/);
    // Navigate back to About section.
    await eventPage.menu.aboutOption.click();
    await expect(page).toHaveURL(/.*\/events\/.*\/about/);
    await expect(aboutPage.getInvolvedCard).toBeVisible();
  });
});
