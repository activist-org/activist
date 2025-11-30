// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToEventSubpage } from "~/test-e2e/actions/navigation/events";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newEventPage } from "~/test-e2e/page-objects/event/EventPage";

test.beforeEach(async ({ page }) => {
  // Already authenticated via global storageState.
  await navigateToEventSubpage(page, "about");

  // Wait for page to be fully loaded.
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

test.describe("Event About Page - QR Code", { tag: ["@desktop"] }, () => {
  test.setTimeout(60000); // Increased timeout for slow dev mode loading.

  test("User can open and close QR code modal", async ({ page }) => {
    const eventPage = newEventPage(page);
    const { qrCodeModal } = eventPage;

    // Wait for QR code button to be visible.
    await expect(eventPage.qrCodeButton).toBeVisible({ timeout: 15000 });

    // Open QR code modal.
    await eventPage.qrCodeButton.click();

    // Verify modal is visible.
    await expect(qrCodeModal.modal).toBeVisible();

    // Verify QR code is displayed.
    const qrCodeImage = qrCodeModal.qrCodeImage(qrCodeModal.modal);
    await expect(qrCodeImage).toBeVisible();

    // Close modal.
    const closeButton = qrCodeModal.closeButton(qrCodeModal.modal);
    await closeButton.click({ force: true });

    // Verify modal is closed.
    await expect(qrCodeModal.modal).not.toBeVisible();
  });

  test("User can download QR code", async ({ page }) => {
    const eventPage = newEventPage(page);
    const { qrCodeModal } = eventPage;

    // Wait for QR code button to be visible.
    await expect(eventPage.qrCodeButton).toBeVisible({ timeout: 15000 });

    // Open QR code modal.
    await eventPage.qrCodeButton.click();

    // Verify modal is visible.
    await expect(qrCodeModal.modal).toBeVisible();

    // Wait for download to start.
    const downloadPromise = page.waitForEvent("download");

    // Click download button.
    const downloadButton = qrCodeModal.downloadButton(qrCodeModal.modal);
    await expect(downloadButton).toBeVisible();
    await downloadButton.click();
    // Verify download initiated and has a filename.
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBeTruthy();
  });
});
