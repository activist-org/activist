// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Mock utilities for Nuxt composables used in query composable tests.
 */
import { vi } from "vitest";
import { ref } from "vue";

/**
 * Creates a mock for useAsyncData that can be configured per test.
 * @param options - Configuration for the mock behavior
 * @param options.data - The data to return from the mock (default: null)
 * @param options.pending - Whether the mock should indicate a pending state (default: false)
 * @param options.error - The error to return from the mock (default: null)
 * @param options.execute - Custom implementation for the execute function (default: a resolved mock function)
 * @returns A mock implementation of useAsyncData with the specified behavior
 */
export function createMockUseAsyncData<T>(
  options: {
    data?: T;
    pending?: boolean;
    error?: Error | null;
    execute?: () => Promise<void>;
  } = {}
) {
  const data = ref(options.data ?? null);
  const pending = ref(options.pending ?? false);
  const error = ref(options.error ?? null);

  return {
    data,
    pending,
    error,
    refresh: options.execute ?? vi.fn().mockResolvedValue(undefined),
    execute: options.execute ?? vi.fn().mockResolvedValue(undefined),
  };
}

/**
 * Creates a mock NuxtApp for testing getCachedData behavior.
 * @param options - Configuration for the mock NuxtApp
 * @param options.isHydrating - Whether the app is in a hydrating state (default: false)
 * @param options.payloadData - The data to include in the payload (default: empty object)
 * @param options.staticData - The data to include in the static data (default: empty object)
 * @returns A mock NuxtApp with the specified configuration
 */
export function createMockNuxtApp(
  options: {
    isHydrating?: boolean;
    payloadData?: Record<string, unknown>;
    staticData?: Record<string, unknown>;
  } = {}
) {
  return {
    isHydrating: options.isHydrating ?? false,
    payload: {
      data: options.payloadData ?? {},
    },
    static: {
      data: options.staticData ?? {},
    },
  };
}
/**
 * Mock for refreshNuxtData function.
 */
export const mockRefreshNuxtData = vi.fn().mockResolvedValue(undefined);
