// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, Locator } from "@playwright/test";

export const newQRCodeModal = (page: Page) => ({
  modal: page.locator("#modal").first(),
  closeButton: (modal: Locator) => modal.getByTestId("modal-close-button"),

  // QR Code image and interaction
  qrCodeContainer: (modal: Locator) => modal.locator("#qr-code"),
  qrCodeImage: (modal: Locator) => modal.locator("#result-qr"),
  qrCodeClickableArea: (modal: Locator) =>
    modal.locator("button").filter({ has: modal.locator("#qr-code") }),
  tooltip: (modal: Locator) => modal.locator("[role='tooltip']"),

  // Download functionality
  downloadDropdown: (modal: Locator) =>
    modal.locator("[aria-label*='qr_code_options']"),
  downloadButton: (modal: Locator) =>
    modal.locator("[aria-label*='download_qr_code']"),
});
