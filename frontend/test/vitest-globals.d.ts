// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Mock } from "vitest";
import type { Composer } from "vue-i18n";
export type FetchOptionsShape = Record<string, unknown>;
export type FetchFn = (
  url: string,
  opts: FetchOptionsShape
) => Promise<unknown>;
export type FetchRawFn = (
  url: string,
  opts: FetchOptionsShape
) => Promise<{ _data: unknown }>;
export interface FetchGlobal extends FetchFn {
  raw: FetchRawFn;
}
/**
 * A generic user object type. Can be extended if a more specific
 * user model is available.
 */
type AuthUser = { [key: string]: unknown } | null;

// These types are based on the mocks in `tests/setup.ts`
declare global {
  var defineStore: typeof import("pinia").defineStore;

  var useI18n: () => Composer;

  var useLocalePath: () => (path: string) => string;

  var useRoute: () => {
    params: Record<string, unknown>;
    query: Record<string, unknown>;
  };

  var useDevice: () => {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  };

  var useLocalStorage: <T>(key: string, defaultValue: T) => { value: T };

  var useAuthState: () => { data: { value: AuthUser } };

  var useAuth: () => {
    signUp: () => Promise<void>;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    data: { value: AuthUser };
  };

  var useUser: () => {
    userIsSignedIn: boolean;
    userIsAdmin: boolean;
    roles: string[];
    signOutUser: () => void;
    canDelete: () => boolean;
    canCreate: () => boolean;
    canView: () => boolean;
  };

  var useDebounceFn: <T extends (...args: unknown[]) => unknown>(
    fn: T,
    delay: number
  ) => T;

  var useColorModeMock: Mock<
    () => { preference: "dark" | "light"; value: "dark" | "light" }
  >;

  var useColorMode: () => ReturnType<typeof useColorModeMock>;

  var useDevMode: () => { active: { value: boolean }; check: () => void };

  var data: { value: AuthUser };

  var useAuthStateMock: Mock<() => { data: { value: AuthUser } }>;

  var $fetch: FetchGlobal;

  var BASE_BACKEND_URL: string;
}

export {};
