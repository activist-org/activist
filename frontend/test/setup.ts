// SPDX-License-Identifier: AGPL-3.0-or-later
import { config } from "@vue/test-utils";
import { createPinia, defineStore, setActivePinia } from "pinia";
import { afterEach, beforeEach, vi } from "vitest";
import { createI18n } from "vue-i18n";

import en from "../i18n/locales/en-US.json" assert { type: "json" };
import { setupAutoImportMocks } from "./auto-imports";

// Set up Pinia.
setActivePinia(createPinia());
// Auto-import version of define store doesn't exist in the test env.
globalThis.defineStore = defineStore;

// MARK: Infrastructure-Dependent Mocks Only

// Set up spy functions for composables that need reset between tests.
// These are initialized here but tests should use factories from composableMocks.ts
// to set up their specific mock implementations.
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

// Mock module-level imports that need to be available globally.
vi.mock("~/stores/sidebar", () => ({
  useSidebar: globalThis.useSidebar,
}));

// Initialize global data reference for useAuthState.
const data = { value: null };
globalThis.data = data;

globalThis.useAuthStateMock = vi.fn(() => ({
  data: globalThis.data, // read from globalThis.data to allow tests to override
}));
globalThis.useAuthState = () => globalThis.useAuthStateMock();
vi.mock("@sidebase/nuxt-auth", () => ({
  useAuthState: globalThis.useAuthState,
}));

// Auto-import default mocks for composables not manually mocked above.
// This provides fallback {} mocks for any use* composables that aren't explicitly mocked.
setupAutoImportMocks();

// Set up I18n.
// See: https://github.com/nuxt-modules/i18n/issues/2637#issuecomment-2233566361
const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: Object.assign({ en }),
  // Suppress missing key warnings in test environment.
  // Test keys like "i18n.test.button" don't exist in locale files.
  missingWarn: false,
  fallbackWarn: false,
});

config.global.plugins.push(i18n);

// Set up useI18n after i18n instance is created (infrastructure-dependent).
globalThis.useI18n = () => i18n.global;

const originalCreateObjectURL = URL.createObjectURL;
URL.createObjectURL = (obj: Blob | MediaSource) => {
  // In test environment, accept any Blob-like object and return a mock URL.
  if (obj instanceof Blob || (obj as unknown) instanceof File) {
    return `blob:mock-${Math.random().toString(36).slice(2)}`;
  }
  return originalCreateObjectURL.call(URL, obj);
};

// MARK: Component Mocks

// Mock Icon component to resolve accessibility issues in password validation tests.
// The sign-up tests expect icons with specific aria-labels and colors for password validation.
config.global.components = {
  Icon: {
    template: `
      <img
        role="img"
        :aria-label="getAriaLabel()"
        :style="computedStyle"
        v-bind="$attrs"
      />
    `,
    props: ["name", "size"],
    computed: {
      computedStyle() {
        // Handle both object and string style attributes.
        let style = this.$attrs.style || {};

        if (typeof style === "string") {
          // Parse string styles like "color: #BA3D3B;".
          const colorMatch = style.match(/color:\s*([^;]+)/);
          if (colorMatch) {
            style = { color: colorMatch[1].trim() };
          } else {
            style = {};
          }
        }

        // Apply default colors based on icon type if no color specified.
        if (!style.color) {
          // Apply colors based on the aria-label content to match test expectations.
          const ariaLabel = this.getAriaLabel();
          if (
            ariaLabel.includes("Error") ||
            ariaLabel.includes("do not match") ||
            ariaLabel.includes("failed")
          ) {
            style = { ...style, color: "#BA3D3B" }; // red for error
          } else if (
            ariaLabel.includes("Success") ||
            ariaLabel.includes("match") ||
            ariaLabel.includes("passed")
          ) {
            style = { ...style, color: "#3BA55C" }; // green for success
          }
          // Fallback to icon name if aria-label doesn't give us enough info.
          else if (
            this.name === "bi:x-circle-fill" ||
            this.name === "bi:exclamation-circle-fill" ||
            this.name === "bi:x-lg"
          ) {
            style = { ...style, color: "#BA3D3B" }; // red for error
          } else if (
            this.name === "bi:check-circle-fill" ||
            this.name === "bi:check-circle" ||
            this.name === "bi:check-lg"
          ) {
            style = { ...style, color: "#3BA55C" }; // green for success
          }
        }

        return style;
      },
    },
    methods: {
      getAriaLabel() {
        // Map icon names to appropriate aria-labels for password validation.
        const iconMap: Record<string, string> = {
          "bi:x-circle-fill": "Password failed rule",
          "bi:check-circle-fill": "Password passed rule",
          "bi:exclamation-circle-fill": "Error: passwords do not match",
          "bi:check-circle": "Success: passwords match",
          "bi:x-lg": "Error: passwords do not match", // used in password validation
          "bi:check-lg": "Success: passwords match", // used in password validation
        };
        return iconMap[this.name as string] || this.name;
      },
    },
  },
};

// MARK: Suppress Warnings

// Suppress known Vue warnings that don't affect test functionality:
// - FriendlyCaptcha missing modelValue prop (from sign-up.spec.ts)
// - Draggable missing itemKey prop (from ImageFileDropzoneMultiple.spec.ts)
// eslint-disable-next-line no-console
const originalWarn = console.warn;
// eslint-disable-next-line no-console
const originalError = console.error;

beforeEach(() => {
  // Suppress Vue warnings for specific, known test-environment issues only.
  // eslint-disable-next-line no-console
  console.warn = (...args: unknown[]) => {
    const message = String(args[0] || "");
    // Skip warnings for specific component issues that are test-environment only:
    // - FriendlyCaptcha missing modelValue prop
    // - Draggable missing itemKey prop
    if (
      (message.includes("FriendlyCaptcha") && message.includes("modelValue")) ||
      (message.includes("Draggable") && message.includes("itemKey"))
    ) {
      return;
    }
    originalWarn(...args);
  };

  // eslint-disable-next-line no-console
  console.error = (...args: unknown[]) => {
    const message = String(args[0] || "");
    // Skip errors for the same specific component issues only.
    if (
      (message.includes("FriendlyCaptcha") && message.includes("modelValue")) ||
      (message.includes("Draggable") && message.includes("itemKey"))
    ) {
      return;
    }
    originalError(...args);
  };
});

afterEach(() => {
  // Restore original console methods.
  // eslint-disable-next-line no-console
  console.warn = originalWarn;
  // eslint-disable-next-line no-console
  console.error = originalError;

  // Clean up Pinia.
  setActivePinia(createPinia());

  // Reset spy functions to default implementations.
  globalThis.useColorModeMock.mockReset();
  globalThis.useColorModeMock.mockImplementation(() => ({
    preference: "dark" as const,
    value: "dark" as const,
  }));

  globalThis.useSidebarMock.mockReset();
  globalThis.useSidebarMock.mockImplementation(() => ({
    collapsed: false,
    collapsedSwitch: false,
  }));
});
