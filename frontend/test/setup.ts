// SPDX-License-Identifier: AGPL-3.0-or-later
import { config } from "@vue/test-utils";
import { createPinia, defineStore, setActivePinia } from "pinia";
import { afterEach, beforeEach, vi } from "vitest";
import { ref } from "vue";
import { createI18n } from "vue-i18n";

import en from "../i18n/locales/en-US.json" with { type: "json" };
import { setupAutoImportMocks } from "./auto-imports";

// Set up Pinia.
setActivePinia(createPinia());
globalThis.defineStore = defineStore;

// MARK: Infrastructure-Dependent Mocks Only

globalThis.useColorModeMock = vi.fn(() => ({
  preference: "dark" as const,
  value: "dark" as const,
}));
globalThis.useColorMode = () => globalThis.useColorModeMock();

globalThis.useSidebarMock = vi.fn(() => ({
  collapsed: false,
  collapsedSwitch: false,
}));
globalThis.useSidebar = () => globalThis.useSidebarMock();

vi.mock("~/stores/sidebar", () => ({
  useSidebar: globalThis.useSidebar,
}));

const data = { value: null };
globalThis.data = data;

globalThis.useAuthStateMock = vi.fn(() => ({
  data: globalThis.data,
}));
globalThis.useAuthState = () => globalThis.useAuthStateMock();
vi.mock("@sidebase/nuxt-auth", () => ({
  useAuthState: globalThis.useAuthState,
}));

// MARK: @pinia/colada Global Mocks (Stable References)

const globalMutationLoading = ref(false);
const globalMutationError = ref<unknown>(null);

// Define stable spies for the cache to ensure test assertions hit the same function
const globalCacheInvalidate = vi.fn();
const globalCacheGetEntries = vi.fn();
const globalCacheSetQueryData = vi.fn();

globalThis.useQueryCacheMock = vi.fn(() => ({
  invalidateQueries: globalCacheInvalidate,
  getEntries: globalCacheGetEntries,
  setQueryData: globalCacheSetQueryData,
}));
globalThis.useQueryCache = () => globalThis.useQueryCacheMock();

globalThis.useMutationMock = vi.fn((options: any = {}) => {
  return {
    mutate: vi.fn(async (vars: any) => {
      globalMutationLoading.value = true;
      globalMutationError.value = null;

      await Promise.resolve();

      try {
        const result = options.mutation
          ? await options.mutation(vars)
          : undefined;
        if (options.onSuccess) options.onSuccess(result, vars);
        return result;
      } catch (err) {
        globalMutationError.value = err;
        if (options.onError) options.onError(err, vars);
        throw err;
      } finally {
        globalMutationLoading.value = false;
        if (options.onSettled) options.onSettled(vars);
      }
    }),
    isLoading: globalMutationLoading,
    error: globalMutationError,
  };
});

globalThis.useMutation = (options: any) => globalThis.useMutationMock(options);

vi.mock("@pinia/colada", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@pinia/colada")>();
  return {
    ...actual,
    useMutation: globalThis.useMutation,
    useQueryCache: globalThis.useQueryCache,
  };
});

// Auto-import default mocks
setupAutoImportMocks();

// Set up I18n.
const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: Object.assign({ en }),
  missingWarn: false,
  fallbackWarn: false,
});

config.global.plugins.push(i18n);
globalThis.useI18n = () => i18n.global;

const originalCreateObjectURL = URL.createObjectURL;
URL.createObjectURL = (obj: Blob | MediaSource) => {
  if (obj instanceof Blob || (obj as unknown) instanceof File) {
    return `blob:mock-${Math.random().toString(36).slice(2)}`;
  }
  return originalCreateObjectURL.call(URL, obj);
};
config.global.provide = {
  [Symbol.for("vue-i18n")]: i18n,
};
config.global.$t = (key: string) => i18n.global.t(key);

// MARK: Component Mocks
config.global.components = {
  Icon: {
    template: `<img role="img" :aria-label="getAriaLabel()" :style="computedStyle" v-bind="$attrs" />`,
    props: ["name", "size"],
    computed: {
      computedStyle() {
        let style = this.$attrs.style || {};
        if (typeof style === "string") {
          const colorMatch = style.match(/color:\s*([^;]+)/);
          style = colorMatch ? { color: colorMatch[1].trim() } : {};
        }
        if (!style.color) {
          const ariaLabel = this.getAriaLabel();
          if (
            ariaLabel.includes("Error") ||
            ariaLabel.includes("do not match") ||
            ariaLabel.includes("failed")
          ) {
            style = { ...style, color: "#BA3D3B" };
          } else if (
            ariaLabel.includes("Success") ||
            ariaLabel.includes("match") ||
            ariaLabel.includes("passed")
          ) {
            style = { ...style, color: "#3BA55C" };
          }
        }
        return style;
      },
    },
    methods: {
      getAriaLabel() {
        const iconMap: Record<string, string> = {
          "bi:x-circle-fill": "Password failed rule",
          "bi:check-circle-fill": "Password passed rule",
          "bi:exclamation-circle-fill": "Error: passwords do not match",
          "bi:check-circle": "Success: passwords match",
          "bi:x-lg": "Error: passwords do not match",
          "bi:check-lg": "Success: passwords match",
        };
        return iconMap[this.name as string] || this.name;
      },
    },
  },
};

// MARK: Suppress Warnings & Teardown
const originalWarn = console.warn;
const originalError = console.error;

beforeEach(() => {
  console.warn = (...args: unknown[]) => {
    const message = String(args[0] || "");
    if (
      (message.includes("FriendlyCaptcha") && message.includes("modelValue")) ||
      (message.includes("Draggable") && message.includes("itemKey"))
    )
      return;
    originalWarn(...args);
  };
  console.error = (...args: unknown[]) => {
    const message = String(args[0] || "");
    if (
      (message.includes("FriendlyCaptcha") && message.includes("modelValue")) ||
      (message.includes("Draggable") && message.includes("itemKey"))
    )
      return;
    originalError(...args);
  };
});

afterEach(() => {
  console.warn = originalWarn;
  console.error = originalError;
  setActivePinia(createPinia());

  globalThis.useColorModeMock.mockReset();
  globalThis.useSidebarMock.mockReset();
  globalThis.useMutationMock.mockClear();
  globalThis.useQueryCacheMock.mockClear();

  // Reset Colada Cache Spies
  globalCacheInvalidate.mockClear();
  globalCacheGetEntries.mockClear();
  globalCacheSetQueryData.mockClear();

  globalMutationLoading.value = false;
  globalMutationError.value = null;
});
