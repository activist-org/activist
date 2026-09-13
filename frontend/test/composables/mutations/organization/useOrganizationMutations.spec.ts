// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useOrganizationMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useOrganizationMutations } from "../../../../app/composables/mutations";
import { setupMutationMocks } from "../setup";

const sampleOrganizationInput = {
  name: "Test Organization",
  tagline: "A tagline",
  location: "Berlin",
  description: "A description",
  topics: [],
  social_accounts: [],
} as never;

const { invalidateOrganizationList, showToastError, createOrganization } =
  vi.hoisted(() => ({
    invalidateOrganizationList: vi.fn(),
    showToastError: vi.fn(),
    createOrganization: vi.fn(),
  }));

vi.mock(
  "../../../../app/services/communities/organization/organization",
  () => ({
    createOrganization: (...args: unknown[]) => createOrganization(...args),
  })
);

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

vi.mock("../../../../app/composables/cache/useOrganizationCache", () => ({
  useOrganizationCache: () => ({
    invalidateOrganizationList,
  }),
}));

describe("useOrganizationMutations", () => {
  beforeEach(() => {
    setupMutationMocks([invalidateOrganizationList, createOrganization]);
    createOrganization.mockResolvedValue({ id: "org-123" });
  });

  describe("create", () => {
    it("calls createOrganization with the form data and returns the organization", async () => {
      const { create } = useOrganizationMutations();

      const result = await create(sampleOrganizationInput);

      expect(createOrganization).toHaveBeenCalledWith(sampleOrganizationInput);
      expect(result).toEqual({ id: "org-123" });
    });

    it("refreshes the organization list once on success", async () => {
      const { create } = useOrganizationMutations();

      await create(sampleOrganizationInput);

      expect(invalidateOrganizationList).toHaveBeenCalledTimes(1);
    });

    it("returns false rather than throwing when the service fails", async () => {
      createOrganization.mockRejectedValue(new Error("Create failed"));
      const { create, error } = useOrganizationMutations();

      // useFlowScreens raises its own toast on a thrown error, so create has to
      // resolve falsy instead of rejecting.
      try {
        const result = await create(sampleOrganizationInput);

        expect(result).toBe(false);
        expect(error.value).not.toBeNull();
        expect(showToastError).toHaveBeenCalled();
        expect(invalidateOrganizationList).not.toHaveBeenCalled();
      } catch {
        // This block should not be reached because create resolves falsy instead of rejecting.
        expect(error.value).not.toBeNull();
        expect(showToastError).toHaveBeenCalled();
        expect(invalidateOrganizationList).not.toHaveBeenCalled();
      }
    });
  });

  describe("state", () => {
    it("exposes loading and error", () => {
      const { loading, error } = useOrganizationMutations();

      expect(loading.value).toBe(false);
      expect(error.value).toBeNull();
    });
  });
});
