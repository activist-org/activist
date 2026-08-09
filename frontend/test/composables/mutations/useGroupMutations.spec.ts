// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGroupMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useGroupMutations } from "../../../app/composables/mutations/useGroupMutations";
import { setupMutationMocks } from "./setup";

const sampleGroupInput = {
  name: "Test Group",
  tagline: "A tagline",
  location: "Berlin",
  description: "A description",
  topics: [],
  social_accounts: [],
} as never;

const {
  mockClearNuxtData,
  showToastError,
  createGroup,
  getOrganization,
  invalidateOrganizationCache,
} = vi.hoisted(() => ({
  mockClearNuxtData: vi.fn(),
  showToastError: vi.fn(),
  createGroup: vi.fn(),
  getOrganization: vi.fn(),
  invalidateOrganizationCache: vi.fn(),
}));

vi.mock("../../../app/services/communities/group/group", () => ({
  createGroup: (...args: unknown[]) => createGroup(...args),
}));

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

vi.mock("../../../app/composables/cache/useOrganizationCache", () => ({
  useOrganizationCache: () => ({ invalidateOrganizationCache }),
}));

vi.mock("../../../app/stores/data/organization", () => ({
  useOrganizationStore: () => ({ getOrganization }),
}));

// The group list is still a useAsyncData read, keyed per filters and page.
mockNuxtImport("clearNuxtData", () => mockClearNuxtData);

describe("useGroupMutations", () => {
  beforeEach(() => {
    setupMutationMocks([createGroup, invalidateOrganizationCache]);
    createGroup.mockResolvedValue({ id: "group-123" });
    getOrganization.mockReturnValue({ id: "org-123" });
  });

  describe("create", () => {
    it("calls createGroup with the form data and returns the group", async () => {
      const { create } = useGroupMutations();

      const result = await create(sampleGroupInput);

      expect(createGroup).toHaveBeenCalledWith(sampleGroupInput);
      expect(result).toEqual({ id: "group-123" });
    });

    it("refreshes the group list on success", async () => {
      const { create } = useGroupMutations();

      await create(sampleGroupInput);

      expect(mockClearNuxtData).toHaveBeenCalled();
      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("returns false rather than throwing when the service fails", async () => {
      createGroup.mockRejectedValue(new Error("Create failed"));
      const { create, error } = useGroupMutations();

      // useFlowScreens raises its own toast on a thrown error, so create has to
      // resolve falsy instead of rejecting.
      const result = await create(sampleGroupInput);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockClearNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("refreshGroupList", () => {
    it("clears only the group list keys", async () => {
      const { refreshGroupList } = useGroupMutations();

      await refreshGroupList();

      const predicate = mockClearNuxtData.mock.calls[0][0] as (
        key: string
      ) => boolean;
      expect(predicate("groups-list:filters:{}:page:1")).toBe(true);
      expect(predicate("organizations-list")).toBe(false);
    });

    it("skips the organization invalidation when no organization is loaded", async () => {
      getOrganization.mockReturnValue(null);
      const { refreshGroupList } = useGroupMutations();

      await refreshGroupList();

      expect(invalidateOrganizationCache).not.toHaveBeenCalled();
    });
  });

  describe("state", () => {
    it("exposes loading and error", () => {
      const { loading, error } = useGroupMutations();

      expect(loading.value).toBe(false);
      expect(error.value).toBeNull();
    });
  });
});
