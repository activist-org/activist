// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Mock } from "vitest";
import type { Composer } from "vue-i18n";

/**
 * A generic user object type. Can be extended if a more specific
 * user model is available.
 */
type AuthUser = { [key: string]: unknown } | null;

// These types are based on the mocks in `tests/setup.ts`
declare global {
  // eslint-disable-next-line no-var
  var defineStore: typeof import("pinia").defineStore;
  // eslint-disable-next-line no-var
  var useI18n: () => Composer;
  // eslint-disable-next-line no-var
  var useLocalePath: () => (path: string) => string;
  // eslint-disable-next-line no-var
  var useRoute: () => { params: Record<string, unknown>; query: Record<string, unknown> };
  // eslint-disable-next-line no-var
  var useDevice: () => {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  };
  // eslint-disable-next-line no-var
  var useLocalStorage: <T>(key: string, defaultValue: T) => { value: T };
  // eslint-disable-next-line no-var
  var useAuthState: () => { data: { value: AuthUser } };
  // eslint-disable-next-line no-var
  var useAuth: () => {
    signUp: () => Promise<void>;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    data: { value: AuthUser };
  };
  // eslint-disable-next-line no-var
  var useUser: () => {
    userIsSignedIn: boolean;
    userIsAdmin: boolean;
    roles: string[];
    signOutUser: () => void;
    canDelete: () => boolean;
    canCreate: () => boolean;
    canView: () => boolean;
  };
  // eslint-disable-next-line no-var
  var useDebounceFn: <T extends (...args: unknown[]) => unknown>(
    fn: T,
    delay: number
  ) => T;

  // eslint-disable-next-line no-var
  var useColorModeMock: Mock<() => { preference: "dark" | "light"; value: "dark" | "light" }>;
  // eslint-disable-next-line no-var
  var useColorMode: () => ReturnType<typeof useColorModeMock>;

  // eslint-disable-next-line no-var
  var useDevMode: () => { active: { value: boolean }; check: () => void };

  // eslint-disable-next-line no-var
  var data: { value: AuthUser };

  // eslint-disable-next-line no-var
  var useAuthStateMock: Mock<() => { data: { value: AuthUser } }>;
}

export {};
