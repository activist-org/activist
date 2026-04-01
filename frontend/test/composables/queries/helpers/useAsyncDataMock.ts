// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Helper utilities for mocking useAsyncData in integration tests.
 * Allows capturing and testing the handler and getCachedData functions.
 */
import { vi } from "vitest";
import { ref, type Ref } from "vue";

/**
 * Result type for captured useAsyncData call.
 */
export interface CapturedUseAsyncData<T> {
  // The async handler function passed to useAsyncData.
  handler: () => Promise<T>;
  // The getCachedData function from options.
  getCachedData: ((key: string, nuxtApp: MockNuxtApp) => T | undefined) | null;
  // The watch array from options.
  watch: unknown[] | null;
  // Whether immediate option was set.
  immediate: boolean;
  // The default function from options.
  defaultFn: (() => T) | null;
}

/**
 * Mock NuxtApp structure for testing getCachedData.
 */
export interface MockNuxtApp {
  isHydrating: boolean;
  payload: { data: Record<string, unknown> };
  static: { data: Record<string, unknown> };
}

/**
 * Creates a mock NuxtApp for testing getCachedData behavior.
 * @param options - Configuration for the mock NuxtApp.
 * @param options.isHydrating - Whether the app is in hydration mode.
 * @param options.payloadData - Data to include in the payload for hydration tests.
 * @param options.staticData - Data to include in the static property for non-hydration tests.
 * @returns A mock NuxtApp object with specified hydration state and data.
 */
export function createMockNuxtApp(
  options: {
    isHydrating?: boolean;
    payloadData?: Record<string, unknown>;
    staticData?: Record<string, unknown>;
  } = {}
): MockNuxtApp {
  return {
    isHydrating: options.isHydrating ?? false,
    payload: { data: options.payloadData ?? {} },
    static: { data: options.staticData ?? {} },
  };
}

/**
 * Creates controlled return values for useAsyncData mock.
 * @param options - Configuration for the mock return values.
 * @param options.data - The data to return in the mock's data ref.
 * @param options.pending - The pending state to return in the mock's pending ref.
 * @param options.error - The error to return in the mock's error ref.
 * @returns An object mimicking the return structure of useAsyncData with refs for data, pending, and error, along with mocked refresh and execute functions.
 */
export function createMockAsyncDataReturn<T>(
  options: {
    data?: T | null;
    pending?: boolean;
    error?: Error | null;
  } = {}
) {
  return {
    data: ref(options.data ?? null) as Ref<T | null>,
    pending: ref(options.pending ?? false),
    error: ref(options.error ?? null) as Ref<Error | null>,
    refresh: vi.fn().mockResolvedValue(undefined),
    execute: vi.fn().mockResolvedValue(undefined),
  };
}

/**
 * Storage for captured useAsyncData calls.
 * Use this to access handler and options in tests.
 */
export const capturedCalls: {
  lastCall: CapturedUseAsyncData<unknown> | null;
  allCalls: CapturedUseAsyncData<unknown>[];
} = {
  lastCall: null,
  allCalls: [],
};

/**
 * Resets captured calls. Call in beforeEach.
 */
export function resetCapturedCalls() {
  capturedCalls.lastCall = null;
  capturedCalls.allCalls = [];
}

/**
 * Creates a useAsyncData mock that captures calls for testing.
 * Returns a factory that produces controlled return values.
 * @param returnOptions - Options to control the returned data, pending state, and error.
 * @param returnOptions.data - The data to return in the mock's data ref.
 * @param returnOptions.pending - The pending state to return in the mock's pending ref.
 * @param returnOptions.error - The error to return in the mock's error ref.
 * @returns A mock function to replace useAsyncData in tests.
 */
export function createUseAsyncDataMock<T>(
  returnOptions: {
    data?: T | null;
    pending?: boolean;
    error?: Error | null;
  } = {}
) {
  return vi.fn(
    (
      keyOrKeyFn: string | (() => string),
      handler: () => Promise<T>,
      options?: {
        watch?: unknown[];
        immediate?: boolean;
        getCachedData?: (key: string, nuxtApp: MockNuxtApp) => T | undefined;
        default?: () => T;
        dedupe?: string;
        server?: boolean;
      }
    ) => {
      const captured: CapturedUseAsyncData<T> = {
        handler,
        getCachedData: options?.getCachedData ?? null,
        watch: options?.watch ?? null,
        immediate: options?.immediate ?? false,
        defaultFn: options?.default ?? null,
      };

      capturedCalls.lastCall = captured as CapturedUseAsyncData<unknown>;
      capturedCalls.allCalls.push(captured as CapturedUseAsyncData<unknown>);

      return createMockAsyncDataReturn<T>(returnOptions);
    }
  );
}
