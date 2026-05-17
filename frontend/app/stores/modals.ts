// SPDX-License-Identifier: AGPL-3.0-or-later
interface Modal {
  isOpen: boolean;
  props?: unknown;
  context?: unknown;
}

export const useModals = defineStore("modals", {
  state: () => ({
    modals: {} as Record<string, Modal>,
  }),

  actions: {
    // Add props and context as separate parameters.
    openModal(modalName: string, props?: unknown, context?: unknown) {
      // 1. Guarantee only one modal is open at a time.
      for (const key in this.modals) {
        if (this.modals[key]) {
          this.modals[key].isOpen = false;
        }
      }

      // 2. Open the new modal.
      this.modals[modalName] = { isOpen: true, props, context };
    },

    closeModal(modalName: string) {
      if (this.modals[modalName]) {
        this.modals[modalName].isOpen = false;
        // Clean up memory to avoid stale data next time it opens.
        this.modals[modalName].props = undefined;
        this.modals[modalName].context = undefined;
      }
    },

    updateContext(modalName: string, context: unknown = {}) {
      if (this.modals[modalName]) {
        this.modals[modalName].context = context;
      }
    },
  },
});
