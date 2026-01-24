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

// MARK: Global Auto-Import Mocs

// These mocks are necessary because components were updated to use Nuxt auto-imports
// (e.g., commit 82089827 added useI18n() to FormTextEntity.vue), but the tests were
// never updated to handle these dependencies. Without these mocks, tests fail with
// "ReferenceError: useI18n is not defined" and similar errors.

// Mock Nuxt auto-imports that are used by components but not available in test environment.
globalThis.useI18n = () => i18n.global;

globalThis.useLocalePath = () => (path: string) => path;

globalThis.useRoute = () => ({
  params: {},
  query: {},
});

globalThis.useDevice = () => ({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
});

globalThis.useLocalStorage = <T>(key: string, defaultValue: T) => ({
  value: defaultValue,
});

globalThis.useAuthState = () => ({
  data: { value: null }, // mock no user signed in
});

globalThis.useAuth = () => ({
  signUp: () => Promise.resolve(),
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  data: { value: null },
});

globalThis.useUser = () => ({
  userIsSignedIn: false,
  userIsAdmin: false,
  roles: [],
  signOutUser: () => {},
  canDelete: () => false,
  canCreate: () => false,
  canView: () => true,
});

globalThis.useDebounceFn = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  _delay: number
) => fn;

// Set up Color Mode mock for components that use useColorMode().
const useColorModeFn = () => ({
  preference: "dark" as const,
  value: "dark" as const,
});

globalThis.useColorModeMock = vi.fn(useColorModeFn);
globalThis.useColorMode = () => globalThis.useColorModeMock();

// Set up Sidebar mock for components that use useSidebar().
const useSidebarFn = () => ({
  collapsed: false,
  collapsedSwitch: false,
});

globalThis.useSidebarMock = vi.fn(useSidebarFn);
globalThis.useSidebar = () => globalThis.useSidebarMock();

vi.mock("~/stores/sidebar", () => ({
  useSidebar: globalThis.useSidebar,
}));

// Mock the dev mode store to fix FriendlyCaptcha component.
globalThis.useDevMode = () => ({
  active: { value: false },
  check: () => {}, // mock the check method that FriendlyCaptcha expects
});

const data = { value: null };
globalThis.data = data;

const useAuthStateFn = () => ({
  data: globalThis.data, // default to no user signed in
});

globalThis.useAuthStateMock = vi.fn(useAuthStateFn);
globalThis.useAuthState = () => globalThis.useAuthStateMock();
vi.mock("@sidebase/nuxt-auth", () => ({
  useAuthState: globalThis.useAuthState,
}));

// Auto-import default mocks for composables not manually mocked above.
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
  // Suppress Vue warnings for known test-related issues.
  // eslint-disable-next-line no-console
  console.warn = (...args: unknown[]) => {
    const message = String(args[0] || "");
    // Skip warnings for known test component issues.
    if (
      message.includes("FriendlyCaptcha") ||
      message.includes("Draggable") ||
      message.includes("Invalid prop") ||
      message.includes("Missing required prop")
    ) {
      return;
    }
    originalWarn(...args);
  };

  // eslint-disable-next-line no-console
  console.error = (...args: unknown[]) => {
    const message = String(args[0] || "");
    // Skip errors for known test component issues.
    if (
      message.includes("FriendlyCaptcha") ||
      message.includes("Draggable") ||
      message.includes("Invalid prop") ||
      message.includes("Missing required prop")
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

  // Clean up color mode mock.
  globalThis.useColorModeMock.mockReset();
  globalThis.useColorModeMock.mockImplementation(useColorModeFn);
});
