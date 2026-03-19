// SPDX-License-Identifier: AGPL-3.0-or-later
import { navigateToOrganizationSubpage } from "~/test-e2e/actions/navigation";
import { newQRCodeModal } from "~/test-e2e/component-objects/QRCodeModal";
import { newShareModal } from "~/test-e2e/component-objects/ShareModal";
import { expect, test } from "~/test-e2e/global-fixtures";
import { newOrganizationsHomePage } from "~/test-e2e/page-objects/OrganizationsHomePage";

test.describe(
  "Organization About Page - QR Code",
  { tag: ["@desktop"] },
  () => {
    test.setTimeout(60000); // Increased timeout for slow dev mode loading.

    test("User can open QR code modal via Share in three-dot menu", async ({
      page,
    }) => {
      await page.goto("/organizations", { waitUntil: "domcontentloaded" });

      // Wait for page to be fully loaded.
      await expect(async () => {
        const isReady = await page.evaluate(
          () => document.readyState === "complete"
        );
        expect(isReady).toBe(true);
      }).toPass({ timeout: 10000, intervals: [100, 250] });

      const homePage = newOrganizationsHomePage(page);
      const shareModal = newShareModal(page);
      const qrCodeModal = newQRCodeModal(page);

      // Wait for organization cards to load.
      await expect(page.getByTestId("organization-card").first()).toBeVisible({
        timeout: 30000,
      });

      // Open three-dot menu on the first card.
      await homePage.getOrganizationMenuButton(0).click();

      // Click Share in the tooltip.
      const shareBtn = homePage.getOrganizationShareButton(0);
      await expect(shareBtn).toBeVisible();
      await shareBtn.click();

      // Share modal opens.
      await expect(shareModal.modal).toBeVisible({ timeout: 10000 });

      // Click QR code button inside share modal.
      const qrCodeBtn = shareModal.qrCodeButton(shareModal.modal);
      await expect(qrCodeBtn).toBeVisible();
      await qrCodeBtn.click({ force: true });

      // QR code modal opens — this was the reported bug.
      await expect(qrCodeModal.modal).toBeVisible({ timeout: 10000 });
      await expect(qrCodeModal.qrCodeImage(qrCodeModal.modal)).toBeVisible();
    });

    test("User can open QR code modal via Share on About page", async ({
      page,
    }) => {
      const { organizationPage } = await navigateToOrganizationSubpage(
        page,
        "about"
      );

      // Wait for page to be fully loaded.
      await expect(async () => {
        const isReady = await page.evaluate(
          () => document.readyState === "complete"
        );
        expect(isReady).toBe(true);
      }).toPass({ timeout: 10000, intervals: [100, 250] });

      const shareModal = newShareModal(page);
      const qrCodeModal = newQRCodeModal(page);

      // Click the Share button on the About page.
      await expect(organizationPage.shareButton).toBeVisible({
        timeout: 15000,
      });
      await organizationPage.shareButton.click();

      // Share modal opens.
      await expect(shareModal.modal).toBeVisible({ timeout: 10000 });

      // Click QR code button inside share modal.
      const qrCodeBtn = shareModal.qrCodeButton(shareModal.modal);
      await expect(qrCodeBtn).toBeVisible();
      await qrCodeBtn.click({ force: true });

      // QR code modal opens — regression test for About page fix.
      await expect(qrCodeModal.modal).toBeVisible({ timeout: 10000 });
      await expect(qrCodeModal.qrCodeImage(qrCodeModal.modal)).toBeVisible();
    });
  }
);
