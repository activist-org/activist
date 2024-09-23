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
  },
});
