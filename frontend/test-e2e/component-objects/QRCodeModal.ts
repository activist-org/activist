// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { getEnglishText } from "#shared/utils/i18n";

export const newQRCodeModal = (page: Page) => ({
  modal: page.locator("#modal").first(),
  closeButton: (modal: Locator) => modal.getByTestId("modal-close-button"),

  // QR Code image and interaction.
  qrCodeContainer: (modal: Locator) => modal.locator("#qr-code"),
  qrCodeImage: (modal: Locator) => modal.locator("#result-qr"),
  qrCodeClickableArea: (modal: Locator) =>
    modal.locator("button").filter({ has: modal.locator("#qr-code") }),
  tooltip: (modal: Locator) => modal.locator("[role='tooltip']"),

  // Download functionality (BtnActionDropdown main button).
  downloadButton: (modal: Locator) =>
    modal.getByRole("button", {
      name: new RegExp(
        getEnglishText(
          "i18n.components.modal_qr_code.download_qr_code_aria_label"
        ),
        "i"
      ),
    }),
});
