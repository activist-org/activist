// SPDX-License-Identifier: AGPL-3.0-or-later
interface Modal {
  isOpen: boolean;
  context?: unknown;
}

export const useModals = defineStore("modals", {
  state: () => ({
    modals: {} as Record<string, Modal>,
  }),

  actions: {
    openModal(modalName: string, params?: unknown) {
      const { modals } = this;
      for (const key in modals) {
        if (modals[key]) {
          modals[key].isOpen = false;
        }
      }
      modals[modalName] = { isOpen: true, context: params };
    },

    closeModal(modalName: string) {
      if (this.modals[modalName]) {
        this.modals[modalName].isOpen = false;
        this.modals[modalName].context = null;
      }
    },
    updateContext(modalName: string, params: unknown = {}) {
      if (this.modals[modalName]) {
        this.modals[modalName].context = params;
      }
    },
  },
});
