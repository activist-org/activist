// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { getEnglishText } from "#shared/utils/i18n";

export const newShareModal = (page: Page) => ({
  modal: page.locator("#modal").first(),
  closeButton: (modal: Locator) => modal.getByTestId("modal-close-button"),
  qrCodeButton: (modal: Locator) =>
    modal.locator("div.group").filter({
      hasText: getEnglishText("i18n.components.modal_qr_code_btn.qr_code"),
    }),
});
