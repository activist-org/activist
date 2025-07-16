// SPDX-License-Identifier: AGPL-3.0-or-later
import { config } from "@vue/test-utils";
import { createPinia, defineStore, setActivePinia } from "pinia";
import { createI18n } from "vue-i18n";

import type { UseColorModeFn } from "~/test/vitest-globals";

import en from "~/i18n/en-US.json" assert { type: "json" };

// Set up Pinia.
setActivePinia(createPinia());

// Auto-import version of define store doesn't exist in the test env.
// @ts-expect-error: Can't type this due to conflict with Nuxt.
globalThis.defineStore = defineStore;

// Set up Color Mode mock.
const useColorModeFn: UseColorModeFn = () => ({
  preference: "dark",
  value: "dark",
});
globalThis.useColorModeMock = vi.fn(useColorModeFn);

// Set up I18n.
// https://github.com/nuxt-modules/i18n/issues/2637#issuecomment-2233566361
const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: Object.assign({ en }),
});

config.global.plugins.push(i18n);

afterEach(() => {
  // Clean up Pinia.
  setActivePinia(createPinia());

  // Clean up color mode mock.
  globalThis.useColorModeMock.mockReset();
  globalThis.useColorModeMock.mockImplementation(useColorModeFn);
});

afterAll(() => {
  // @ts-expect-error: This will be present during the tests.
  delete globalThis.useColorModeMock;
});
