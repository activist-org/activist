import { useNuxtApp } from '#app';
import { config } from '@vue/test-utils';
import { createPinia, setActivePinia, defineStore } from 'pinia';
import type { UseColorModeFn } from "@/types/vitest-globals";

// Set up Pinia;
setActivePinia(createPinia());
// Allows auto-import of defineStore in vitest env
globalThis.defineStore = defineStore;

// Set up Color Mode mock
const useColorModeFn: UseColorModeFn = () => ({ preference: 'dark', value: 'dark' });
globalThis.useColorModeMock = vi.fn(useColorModeFn);

// I18n set up
beforeAll(() => {
  // https://github.com/nuxt/test-utils/issues/566
  const nuxtApp = useNuxtApp();

  config.global.plugins.push({
    async install(app, ...options) {
      // @ts-expect-error Typescript cannot detect Nuxt plugins
      const i18n = nuxtApp.vueApp.__VUE_I18N__;

      await i18n.install(app, ...options);
    },
  });
});

afterEach(() => {
  // Clean up Pinia
  setActivePinia(createPinia());

  // Clean up color mode mock
  globalThis.useColorModeMock.mockReset();
  globalThis.useColorModeMock.mockImplementation(useColorModeFn);
});

afterAll(() => {
  // @ts-expect-error type This will be present during the tests
  delete globalThis.useColorModeMock;
});
