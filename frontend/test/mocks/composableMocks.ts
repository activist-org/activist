// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Factory functions for creating composable mocks in tests.
 *
 * These factories allow tests to explicitly define their mock needs using
 * reusable functions. This makes test dependencies clear and maintainable.
 *
 * Usage patterns:
 * 1. Use auto-mock as-is (if default {} from auto-import works)
 * 2. Import factory and use it: globalThis.useRoute = createUseRouteMock({ id: "123" })
 * 3. Override with spy for call tracking: vi.stubGlobal("useRoute", vi.fn(...))
 * 4. Use mockImplementation() on spy functions
 * 5. Set defaults in beforeEach using factories, override per-test
 */

import type { Composer } from "vue-i18n";

import { vi } from "vitest";

import type { User } from "../../shared/types/user";

// AuthUser type from vitest-globals.d.ts.
type AuthUser = { [key: string]: unknown } | null;

// MARK: I18n

/**
 * Creates a mock for useI18n composable.
 * Note: Most tests should use the default from setup.ts which provides the real i18n instance.
 * Only use this if you need a completely custom i18n mock.
 * @param composer - I18n composer instance (optional)
 */
export function createUseI18nMock(composer?: Composer) {
  return () => composer || ({} as Composer);
}

// MARK: Route & Navigation

/**
 * Creates a mock for useRoute composable.
 * @param params - Route parameters (default: {})
 * @param query - Query parameters (default: {})
 * @param path - Route path (default: "/")
 * @param name - Route name (optional)
 */
export function createUseRouteMock(
  params: Record<string, unknown> = {},
  query: Record<string, unknown> = {},
  path = "/",
  name?: string
) {
  return () => ({
    params,
    query,
    path,
    name,
  });
}

/**
 * Creates a mock for useRouter composable.
 * @param push - Router push function (default: vi.fn())
 * @param currentRoute - Current route value (default: { name: "home" })
 */
export function createUseRouterMock(
  push = vi.fn(),
  currentRoute = { value: { name: "home" } }
) {
  return () => ({
    push,
    currentRoute,
  });
}

/**
 * Creates a mock for useLocalePath composable.
 * @param prefix - Locale prefix to prepend (default: "/en")
 */
export function createUseLocalePathMock(prefix = "/en") {
  return () => (path: string) => `${prefix}${path}`;
}

// MARK: Device & Viewport

/**
 * Creates a mock for useDevice composable.
 * @param isMobile - Whether device is mobile (default: false)
 * @param isTablet - Whether device is tablet (default: false)
 * @param isDesktop - Whether device is desktop (default: true)
 */
export function createUseDeviceMock(
  isMobile = false,
  isTablet = false,
  isDesktop = true
) {
  return () => ({
    isMobile,
    isTablet,
    isDesktop,
  });
}

// MARK: Storage

/**
 * Creates a mock for useLocalStorage composable.
 * @param defaultValue - Default value to return (default: null)
 */
export function createUseLocalStorageMock<T>(defaultValue: T) {
  return (_key: string, _defaultValue: T) => ({
    value: defaultValue,
  });
}

// MARK: Authentication & User

/**
 * Creates a mock for useAuthState composable.
 * @param user - User object or null (default: null)
 */
export function createUseAuthStateMock(user: User | null = null) {
  return () => ({
    data: { value: user },
  });
}

/**
 * Creates a mock for useUserSession composable (nuxt-auth-utils).
 * @param loggedIn - Whether user is logged in (default: false)
 * @param user - User object or null (default: null)
 * @param clear - Clear session function (default: vi.fn())
 */
export function createUseUserSessionMock(
  loggedIn = false,
  user: AuthUser = null,
  clear = vi.fn()
) {
  return () => ({
    loggedIn: { value: loggedIn },
    user: { value: user },
    clear,
  });
}

/**
 * Creates a mock for useAuth composable.
 * @param user - User object or null (default: null). Accepts User type but returns AuthUser-compatible value.
 * @param token - Auth token (default: null)
 * @param signUp - Sign up function (default: resolved promise)
 * @param signIn - Sign in function (default: resolved promise)
 * @param signOut - Sign out function (default: resolved promise)
 */
export function createUseAuthMock(
  user: AuthUser = null,
  token: string | null = null,
  signUp = () => Promise.resolve(),
  signIn = () => Promise.resolve(),
  signOut = () => Promise.resolve()
) {
  return () => ({
    signUp,
    signIn,
    signOut,
    data: { value: user },
    token: token !== null ? { value: token } : undefined,
  });
}

/**
 * Creates a mock for useUser composable.
 * @param userIsSignedIn - Whether user is signed in (default: false)
 * @param userIsAdmin - Whether user is admin (default: false)
 * @param canDelete - Can delete function (default: () => false)
 * @param canCreate - Can create function (default: () => false)
 * @param canView - Can view function (default: () => true)
 * @param canEdit - Can edit function (optional)
 */
export function createUseUserMock(
  userIsSignedIn = false,
  userIsAdmin = false,
  canDelete = () => false,
  canCreate = () => false,
  canView = () => true,
  canEdit?: (entity?: unknown) => boolean
) {
  return () => ({
    userIsSignedIn,
    userIsAdmin,
    roles: [],
    signOutUser: () => {},
    canDelete,
    canCreate,
    canView,
    ...(canEdit !== undefined && { canEdit }),
    user: null,
  });
}

// MARK: Utilities

/**
 * Creates a mock for useDebounceFn composable.
 * By default, returns the function unchanged (no debouncing in tests).
 */
export function createUseDebounceFnMock() {
  return <T extends (...args: unknown[]) => unknown>(fn: T, _delay: number) =>
    fn;
}

// MARK: Color Mode

/**
 * Creates a spy function for useColorMode composable.
 * Returns a vi.fn() that can be configured with mockImplementation().
 * @param preference - Color preference (default: "dark")
 * @param value - Current color value (default: "dark")
 */
export function createUseColorModeSpy(
  preference: "dark" | "light" = "dark",
  value: "dark" | "light" = "dark"
) {
  return vi.fn(() => ({
    preference,
    value,
  }));
}

// MARK: Sidebar

/**
 * Creates a spy function for useSidebar composable.
 * Returns a vi.fn() that can be configured with mockImplementation().
 * @param collapsed - Whether sidebar is collapsed (default: false)
 * @param collapsedSwitch - Whether toggle switch is in collapsed mode (default: false)
 */
export function createUseSidebarSpy(
  collapsed = false,
  collapsedSwitch = false
) {
  return vi.fn(() => ({
    collapsed,
    collapsedSwitch,
  }));
}

// MARK: Dev Mode

/**
 * Creates a mock for useDevMode composable.
 * @param active - Whether dev mode is active (default: false)
 * @param check - Check function (default: no-op)
 */
export function createUseDevModeMock(active = false, check = () => {}) {
  return () => ({
    active: { value: active },
    check,
  });
}
