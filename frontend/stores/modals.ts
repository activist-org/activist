import { defineStore } from "pinia";

interface Modal {
  isOpen: boolean;
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

    // These two methods reproduce the functionality in the openModal() and handleCloseModal() methods that are currently copy-pasted a lot, throughout the code.
    // They are called in useModalHandlers.ts
    // useModalHandlers.ts returns a usable version of openModal() and handleCloseModal() that is written in one place.
    // It also allows for multiple modal handlers on a page / component.
    // We can also rename the modal handlers so that the code is a little more self-documenting and readable.
    // We use mostly the openModal... method. closeModal... is here for completeness.
    openModalAndUpdateState(modalName: string) {
      this.openModal(modalName);
      return this.modals[modalName].isOpen;
    },

    closeModalAndUpdateState(modalName: string) {
      this.closeModal(modalName);
      return this.modals[modalName].isOpen;
    }
  },
});
