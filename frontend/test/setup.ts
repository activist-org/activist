import { useNuxtApp } from "#app";
import { config } from "@vue/test-utils";
import { createPinia, defineStore, setActivePinia } from "pinia";
import type { UseColorModeFn } from "~/test/vitest-globals";

// Set up Pinia.
setActivePinia(createPinia());

// Auto-import version of define store doesn't exist in the test env.
// @ts-expect-error Can't type this due to conflict with Nuxt.
globalThis.defineStore = defineStore;

// Set up Color Mode mock.
const useColorModeFn: UseColorModeFn = () => ({
  preference: "dark",
  value: "dark",
});
globalThis.useColorModeMock = vi.fn(useColorModeFn);

// Set up I18n.
beforeAll(() => {
  // https://github.com/nuxt/test-utils/issues/566
  const nuxtApp = useNuxtApp();

  config.global.plugins.push({
    async install(app, ...options) {
      // @ts-expect-error Typescript cannot detect Nuxt plugins.
      const i18n = nuxtApp.vueApp.__VUE_I18N__;

      await i18n.install(app, ...options);
    },
  });
});

afterEach(() => {
  // Clean up Pinia.
  setActivePinia(createPinia());

  // Clean up color mode mock.
  globalThis.useColorModeMock.mockReset();
  globalThis.useColorModeMock.mockImplementation(useColorModeFn);
});

afterAll(() => {
  // @ts-expect-error type This will be present during the tests.
  delete globalThis.useColorModeMock;
});
