import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";

export const useSidebar = defineStore("sidebar", {
  state: () => ({
    collapsed: useLocalStorage("collapsed", false),
  }),

  actions: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
  },
});
