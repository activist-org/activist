// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Shared fixtures and helpers for mutation composable tests.
 * Mock factories live in test/mocks/composableMocks.ts per #1753.
 * @see https://github.com/activist-org/activist/issues/1753
 */
import { vi } from "vitest";

import {
  defaultFaqEntryData as sampleFaqEntry,
  defaultFaqDataForCreate as sampleFaqData,
} from "../../mocks/data";

export { sampleFaqEntry, sampleFaqData };

type MockWithResolve = { mockResolvedValue?: (v: unknown) => unknown };

/**
 * Resets mutation mocks to default resolved state.
 * Call in beforeEach; pass all mocks that need mockResolvedValue(undefined).
 */
export function setupMutationMocks(
  mocks: MockWithResolve[]
): void {
  vi.clearAllMocks();
  mocks.forEach((m) => m.mockResolvedValue?.(undefined));
}
