// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Mock utilities for Nuxt composables used in query composable tests.
 */
import { vi } from "vitest";
import { ref } from "vue";

/**
 * Creates a mock for useAsyncData that can be configured per test.
 *
 * @param options - Configuration for the mock behavior
 * @returns Mocked useAsyncData return value
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
