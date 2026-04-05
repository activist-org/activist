// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineStore } from "pinia";

export const useDevMode = defineStore("devMode", {
  state: () => ({
    // SSR: always false; Client: use localStorage
    active: import.meta.env.DEV,
  }),

  actions: {
    check() {
      if (import.meta.client) {
        this.active = window.location.href.includes(":3000");
        return;
      }
      this.active = import.meta.env.DEV;
    },
  },
});
