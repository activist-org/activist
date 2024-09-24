import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";

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
