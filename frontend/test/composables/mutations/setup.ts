// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Shared fixtures and helpers for mutation composable tests.
 * Mock factories live in test/mocks/composableMocks.ts per #1753.
 * @see https://github.com/activist-org/activist/issues/1753
 */
import { vi } from "vitest";

import { UploadableFile } from "../../../shared/types/file";
import {
  defaultEventUpdateTextFormData as sampleEventTextFormData,
  defaultFaqEntryData as sampleFaqEntry,
  defaultFaqDataForCreate as sampleFaqData,
  defaultGroupUpdateTextFormData as sampleGroupTextFormData,
  defaultOrganizationUpdateTextFormData as sampleOrganizationTextFormData,
  defaultResourceInputData as sampleResourceInput,
  defaultSocialLinkInputData as sampleSocialLinkInput,
} from "../../mocks/data";

export { sampleFaqEntry, sampleFaqData };
export {
  sampleEventTextFormData,
  sampleGroupTextFormData,
  sampleOrganizationTextFormData,
  sampleResourceInput,
  sampleSocialLinkInput,
};

/** Minimal UploadableFile for mutation tests. */
/**
 * Creates a sample UploadableFile for testing file upload mutations.
 * @returns An UploadableFile instance with a simple text file named "icon.png".
 */
export function createSampleUploadableFile(): UploadableFile {
  return new UploadableFile(new File(["x"], "icon.png", { type: "image/png" }));
}

type MockWithResolve = { mockResolvedValue?: (v: unknown) => unknown };

/**
 * Resets mutation mocks to default resolved state.
 * Call in beforeEach; pass all mocks that need mockResolvedValue(undefined).
 * @param mocks - Array of mocks to reset, each optionally having a mockResolvedValue method.
 */
export function setupMutationMocks(mocks: MockWithResolve[]): void {
  vi.clearAllMocks();
  mocks.forEach((m) => m.mockResolvedValue?.(undefined));
}
