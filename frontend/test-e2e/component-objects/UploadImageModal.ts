// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

export const newUploadImageModal = (page: Page) => ({
  modal: page.locator("#modal").first(),
  closeButton: (modal: Locator) => modal.getByTestId("modal-close-button"),
  imageUploadInput: (modal: Locator) => modal.locator("input").first(),
  uploadButton: (modal: Locator) =>
    modal.getByTestId("upload-image-upload-button"),
  removeButton: (modal: Locator, index: number) =>
    modal.getByTestId(`upload-image-remove-${index}`),
  getUploadedImages: (modal: Locator) => modal.getByRole("img"),
});
