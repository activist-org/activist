// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Common setup utilities for query composable tests.
 */
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, vi } from "vitest";

import { resetAllServiceMocks } from "../../mocks/serviceMocks";

/**
 * Standard setup for query composable tests.
 * Call this in your describe block's beforeEach.
 */
export function setupQueryComposableTest() {
  beforeEach(() => {
    // Fresh Pinia instance for each test.
    setActivePinia(createPinia());

    // Reset all service mocks.
    resetAllServiceMocks();
    // Clear all other mocks.
    vi.clearAllMocks();
  });
}
