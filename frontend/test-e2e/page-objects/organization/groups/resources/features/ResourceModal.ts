// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "@playwright/test";

import { getEnglishText } from "~/utils/i18n";

/**
 * Resource Modal Feature
 * Handles resource creation/edit modal interactions
 */
export const ResourceModal = (page: Page) => {
  return {
    // MARK: Modal Container

    get resourceModal() {
      return page.getByTestId("modal-ModalResourceGroup");
    },

    get resourceModalCloseButton() {
      return this.resourceModal.getByTestId("modal-close-button");
    },

    get editResourceModal() {
      return page.getByTestId("modal-ModalResourceGroup");
    },

    get editResourceModalCloseButton() {
      return this.editResourceModal.getByTestId("modal-close-button");
    },

    // MARK: Form Elements

    getResourceNameInput(modal: Locator) {
      return modal.getByRole("textbox", {
        name: new RegExp(getEnglishText("i18n.pages.contact.name"), "i"),
      });
    },

    getResourceDescriptionInput(modal: Locator) {
      return modal.getByRole("textbox", {
        name: new RegExp(getEnglishText("i18n._global.description"), "i"),
      });
    },

    getResourceUrlInput(modal: Locator) {
      return modal.getByRole("textbox", {
        name: new RegExp(
          getEnglishText("i18n.components.form_resource.link"),
          "i"
        ),
      });
    },

    getResourceSubmitButton(modal: Locator) {
      return modal.getByRole("button", {
        name: new RegExp(getEnglishText("i18n.components.submit"), "i"),
      });
    },

    // MARK: Actions

    async fillResourceForm(
      modal: Locator,
      name: string,
      description: string,
      url: string
    ) {
      await this.getResourceNameInput(modal).fill(name);
      await this.getResourceDescriptionInput(modal).fill(description);
      await this.getResourceUrlInput(modal).fill(url);
    },

    async submitResourceForm(modal: Locator) {
      await this.getResourceSubmitButton(modal).click();
    },

    async closeModal() {
      await this.resourceModalCloseButton.click();
    },
  };
};
export type ResourceModalType = ReturnType<typeof ResourceModal>;
