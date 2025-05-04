// SPDX-License-Identifier: AGPL-3.0-or-later
import type { FileUploadEntity } from "~/types/content/file-upload-entity";

interface Modal {
  isOpen: boolean;
  data?: {
    fileUploadEntity?: FileUploadEntity;
  };
}

export const useModals = defineStore("modals", {
  state: () => ({
    modals: {} as Record<string, Modal>,
  }),

  actions: {
    openModal(modalName: string) {
      const { modals } = this;
      for (const key in modals) {
        modals[key].isOpen = false;
      }
      modals[modalName] = { isOpen: true };
    },

    closeModal(modalName: string) {
      if (this.modals[modalName]) {
        this.modals[modalName].isOpen = false;
      }
    },

    // The following are called in useModalHandlers.ts.
    // They allow for multiple modal handlers on a page / component.
    // We can rename the modal handlers so that the code is a little more self-documenting and readable.
    openModalAndUpdateState(
      modalName: string,
      params?: { fileUploadEntity?: FileUploadEntity }
    ) {
      this.openModal(modalName);

      this.modals[modalName] = {
        ...this.modals[modalName],
        data: {
          fileUploadEntity:
            params?.fileUploadEntity ??
            this.modals[modalName]?.data?.fileUploadEntity,
        },
      };

      return this.modals[modalName];
    },

    closeModalAndUpdateState(modalName: string) {
      this.closeModal(modalName);
      return this.modals[modalName].isOpen;
    },
  },
});
