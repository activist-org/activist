// SPDX-License-Identifier: AGPL-3.0-or-later
export const useDevMode = defineStore("devMode", {
  state: () => ({
    active: useLocalStorage("active", false),
  }),

  actions: {
    check() {
      this.active = window.location.href.includes("localhost:3000");
    },
  },
});
