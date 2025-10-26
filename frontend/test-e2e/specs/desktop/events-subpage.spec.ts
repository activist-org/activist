// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "playwright/test";

import { getEnglishText } from "../../../app/utils/i18n";
import { runAccessibilityTest } from "../../accessibility/accessibilityTesting";
import { newSidebarLeft } from "../../component-objects/SidebarLeft";

const MODAL_BUTTON_NAMES = [
  getEnglishText("i18n._global.share_event_aria_label"),
  getEnglishText("i18n.components.modal_qr_code_btn.open_modal_aria_label"),
];

const EVENT_SUBPAGES = [
  getEnglishText("i18n.composables.use_menu_entries_state.team").toLowerCase(),
  getEnglishText("i18n._global.resources").toLowerCase(),
  getEnglishText("i18n._global.faq").toLowerCase(),
  getEnglishText("i18n.composables.use_menu_entries_state.tasks").toLowerCase(),
  getEnglishText("i18n._global.discussion").toLowerCase(),
  getEnglishText("i18n._global.settings").toLowerCase(),
];

test.beforeEach(async ({ page }) => {
  // Navigate to events page first, then to an event's about page.
  await page.goto("/events?view=list", { timeout: 20000 });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Events home/i
  );

  // Click on the first event to navigate to its about page.
  const firstEventLink = page
    .getByLabel(
      getEnglishText(
        "i18n.components.card_search_result_entity_event.navigate_to_event_aria_label"
      )
    )
    .first();
  await expect(firstEventLink).toBeVisible();
  await firstEventLink.click();
  await page.waitForURL("**/events/**/about");

  const sidebar = newSidebarLeft(page);
  await expect(sidebar.root).toBeVisible();
});

test.describe(
  "Test modal and sidebar functionality, also accessibility and hydration",
  { tag: "@desktop" },
  () => {
    test("Test closing and opening of modals", async ({ page }) => {
      for (const buttonName of MODAL_BUTTON_NAMES) {
        const qrButton = page.getByRole("button", { name: buttonName });
        await expect(qrButton).toBeVisible();

        await qrButton.click();

        const modal = page.locator("#search-modal").first();
        await expect(modal).toBeVisible();
        // Close modal using the close button with proper selector.
        const closeButton = page.locator("button:has(.i-bi\\:x-circle-fill)");
        await closeButton.click();
      }
    });

    test("QR code download works correctly", async ({ page }) => {
      await page
        .getByRole("button", {
          name: getEnglishText(
            "i18n.components.modal_qr_code_btn.open_modal_aria_label"
          ),
        })
        .click();
      const downloadPromise = page.waitForEvent("download");

      await page
        .getByRole("button", {
          name: getEnglishText(
            "i18n.components.modal_qr_code.download_qr_code_aria_label"
          ),
        })
        .click();

      const download = await downloadPromise;
      await expect(download.suggestedFilename()).toBeTruthy();
    });

    test("Test if sidebarButtons work correctly", async ({ page }) => {
      for (const text of EVENT_SUBPAGES) {
        const sidebarButton = page.locator("#event-" + text);
        await expect(sidebarButton).toBeVisible();

        await sidebarButton.click();
        await expect(page).toHaveURL(new RegExp(`/${text}$`));
      }
    });

    test("test opening of details modal", async ({ page }) => {
      const detailsDiv = page.locator(
        "div.cursor-pointer.text-primary-text:has(svg)"
      );
      await detailsDiv.click();

      const modal = page.locator("#search-modal").first();
      await expect(modal).toBeVisible();
    });

    test("Check if editing of About page works correctly", async ({ page }) => {
      const detailsDiv = page.locator(
        "div.cursor-pointer.text-primary-text:has(svg)"
      );
      await detailsDiv.click();

      const textarea = page.locator("#form-item-description");
      await textarea.waitFor({ state: "visible" });

      // Modify event description.
      await textarea.clear();
      const newRandomText = "This is random text";
      await textarea.fill(newRandomText);
      await page.click("#form-submit-id");

      // Close modal.
      const closeButton = page.getByRole("button", {
        name: getEnglishText(
          "i18n.components.modal_base.close_modal_aria_label"
        ),
      });
      await closeButton.click();

      //check if about event description changed.
      const aboutSection = page.getByTestId("event-about-section");
      const paragraph = aboutSection.locator("p").first();
      await expect(paragraph).toHaveText(newRandomText);
    });

    test("Test hydration of event title and key elements", async ({ page }) => {
      await page.waitForLoadState("networkidle");

      const eventTitle = page.locator("h1");
      await expect(eventTitle).toBeVisible();
      await expect(eventTitle).toHaveText(/./);

      const getInvolvedButton = page.getByRole("button", {
        name: new RegExp(getEnglishText("i18n._global.offer_to_help"), "i"),
      });
      if (await getInvolvedButton.isVisible()) {
        await expect(getInvolvedButton).toBeEnabled();
      }
    });

    test("Test hydration of interactive components", async ({ page }) => {
      await page.waitForLoadState("networkidle");

      const shareButton = page.getByRole("button", {
        name: new RegExp(getEnglishText("i18n._global.share"), "i"),
      });
      await expect(async () => {
        await expect(shareButton).toBeVisible();
        await expect(shareButton).toBeEnabled();
      }).toPass({ timeout: 500 });

      const subscribeButton = page.getByLabel(
        getEnglishText("i18n._global.subscribe_to_event_aria_label")
      );
      await expect(async () => {
        await expect(subscribeButton).toBeVisible();
        await expect(subscribeButton).toBeEnabled();
      }).toPass({ timeout: 500 });
    });

    test("Test keyboard navigation and focus management", async ({ page }) => {
      await page.waitForLoadState("networkidle");

      const shareButton = page.getByRole("button", {
        name: new RegExp(getEnglishText("i18n._global.share"), "i"),
      });
      await shareButton.focus();
      await expect(shareButton).toBeFocused();

      await page.keyboard.press("Tab");
      const subscribeButton = page.getByLabel(
        getEnglishText("i18n._global.subscribe_to_event_aria_label")
      );
      await expect(subscribeButton).toBeFocused();

      await page.keyboard.press("Enter");
      await page.waitForTimeout(500);
    });

    test("Test ARIA labels and semantic structure", async ({ page }) => {
      await page.waitForLoadState("networkidle");

      const shareButton = page.getByRole("button", {
        name: new RegExp(getEnglishText("i18n._global.share"), "i"),
      });
      await expect(shareButton).toHaveAttribute("aria-label");

      const subscribeButton = page.getByLabel(
        getEnglishText("i18n._global.subscribe_to_event_aria_label")
      );
      await expect(subscribeButton).toHaveAttribute("aria-label");

      const mainContent = page.locator('main, [role="main"], h1').first();
      await expect(mainContent).toBeVisible();
    });

    test("Run accessibility scan", async ({ page }, testInfo) => {
      await page.waitForLoadState("networkidle");

      const violations = await runAccessibilityTest(
        "events-subpage",
        page,
        testInfo
      );

      expect(violations).toHaveLength(0);
    });
  }
);
