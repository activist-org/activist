// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGroupMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
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

const { createGroup, invalidateGroupList, showToastError } = vi.hoisted(() => ({
  createGroup: vi.fn(),
  invalidateGroupList: vi.fn(),
  showToastError: vi.fn(),
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

vi.mock("../../../app/composables/cache/useGroupCache", () => ({
  useGroupCache: () => ({ invalidateGroupList }),
}));

describe("useGroupMutations", () => {
  beforeEach(() => {
    setupMutationMocks([createGroup, invalidateGroupList]);
    createGroup.mockResolvedValue({ id: "group-123" });
  });

  describe("create", () => {
    it("calls createGroup with form data and returns created group on success", async () => {
      const { create } = useGroupMutations();

      const result = await create(sampleGroupInput);

      expect(createGroup).toHaveBeenCalledWith(sampleGroupInput);
      expect(result).toEqual({ id: "group-123" });
    });

    it("calls invalidateGroupList via onSuccess on success", async () => {
      const { create } = useGroupMutations();

      await create(sampleGroupInput);

      expect(invalidateGroupList).toHaveBeenCalled();
    });

    it("rejects and does not invalidate group list when service throws", async () => {
      createGroup.mockRejectedValue(new Error("Create failed"));
      const { create } = useGroupMutations();

      await expect(create(sampleGroupInput)).rejects.toThrow("Create failed");

      expect(invalidateGroupList).not.toHaveBeenCalled();
    });
  });

  describe("state", () => {
    it("exposes loading and error", () => {
      const { loading, error } = useGroupMutations();

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
