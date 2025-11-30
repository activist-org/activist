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

// These types are based on the mocks in `tests/setup.ts`.
declare global {
  const defineStore: typeof import("pinia").defineStore;

  const useI18n: () => Composer;

  const useLocalePath: () => (path: string) => string;

  const useRoute: () => {
    params: Record<string, unknown>;
    query: Record<string, unknown>;
  };

  const useDevice: () => {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  };

  const useLocalStorage: <T>(key: string, defaultValue: T) => { value: T };

  const useAuthState: () => { data: { value: AuthUser } };

  const useAuth: () => {
    signUp: () => Promise<void>;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    data: { value: AuthUser };
  };

  const useUser: () => {
    userIsSignedIn: boolean;
    userIsAdmin: boolean;
    roles: string[];
    signOutUser: () => void;
    canDelete: () => boolean;
    canCreate: () => boolean;
    canView: () => boolean;
  };

  const useDebounceFn: <T extends (...args: unknown[]) => unknown>(
    fn: T,
    delay: number
  ) => T;

  const useColorModeMock: Mock<
    () => { preference: "dark" | "light"; value: "dark" | "light" }
  >;

  const useColorMode: () => ReturnType<typeof useColorModeMock>;

  const useSidebarMock: Mock<
    () => { collapsed: boolean; collapsedSwitch: boolean }
  >;

  const useSidebar: () => ReturnType<typeof useSidebarMock>;

  const useDevMode: () => { active: { value: boolean }; check: () => void };

  const data: { value: AuthUser };

  const useAuthStateMock: Mock<() => { data: { value: AuthUser } }>;

  const $fetch: FetchGlobal;

  const BASE_BACKEND_URL: string;
}

export {};
