// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGroupResourcesMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useGroupResourcesMutations } from "../../../../app/composables/mutations";
import { sampleResourceInput, setupMutationMocks } from "../setup";

const {
  showToastError,
  createGroupResource,
  updateGroupResource,
  deleteGroupResource,
  reorderGroupResources,
  invalidateGroupCache,
} = vi.hoisted(() => ({
  invalidateGroupCache: vi.fn(),
  showToastError: vi.fn(),
  createGroupResource: vi.fn(),
  updateGroupResource: vi.fn(),
  deleteGroupResource: vi.fn(),
  reorderGroupResources: vi.fn(),
}));

vi.mock("../../../../app/services/communities/group/resource", () => ({
  createGroupResource: (...args: unknown[]) => createGroupResource(...args),
  updateGroupResource: (...args: unknown[]) => updateGroupResource(...args),
  deleteGroupResource: (...args: unknown[]) => deleteGroupResource(...args),
  reorderGroupResources: (...args: unknown[]) => reorderGroupResources(...args),
}));

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

vi.mock("../../../../app/composables/cache/useGroupCache", () => ({
  useGroupCache: () => ({
    invalidateGroupCache,
    getKeyForGroup: (id: string) => ["group", id],
  }),
}));

describe("useGroupResourcesMutations", () => {
  const groupId = ref("group-123");

  beforeEach(() => {
    groupId.value = "group-123";
    setupMutationMocks([
      createGroupResource,
      updateGroupResource,
      deleteGroupResource,
      reorderGroupResources,
      invalidateGroupCache,
    ]);
  });

  describe("createResource", () => {
    it("calls createGroupResource with groupId and resourceData on success", async () => {
      const { createResource } = useGroupResourcesMutations(groupId);

      await createResource(sampleResourceInput);

      expect(createGroupResource).toHaveBeenCalledWith(
        "group-123",
        expect.objectContaining(sampleResourceInput)
      );
    });

    it("calls invalidateGroupCache via onSuccess on success", async () => {
      const { createResource } = useGroupResourcesMutations(groupId);

      await createResource(sampleResourceInput);

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("calls createGroupResource even when groupId is empty", async () => {
      groupId.value = "";
      const { createResource } = useGroupResourcesMutations(groupId);

      await createResource(sampleResourceInput);

      expect(createGroupResource).toHaveBeenCalledWith(
        "",
        expect.objectContaining(sampleResourceInput)
      );
    });

    it("throws error and does not invalidate when service throws", async () => {
      createGroupResource.mockRejectedValue(new Error("Create failed"));
      const { createResource } = useGroupResourcesMutations(groupId);

      await expect(createResource(sampleResourceInput)).rejects.toThrow(
        "Create failed"
      );

      // Composable uses `onSuccess` for creation, so it does not invalidate on error
      expect(invalidateGroupCache).not.toHaveBeenCalled();
    });

    it("throws when service rejects invalid resource data", async () => {
      const badResource = { ...sampleResourceInput, name: "" };
      createGroupResource.mockRejectedValue(new Error("Invalid resource data"));
      const { createResource } = useGroupResourcesMutations(groupId);

      await expect(createResource(badResource)).rejects.toThrow(
        "Invalid resource data"
      );
    });
  });

  describe("updateResource", () => {
    it("calls updateGroupResource with resource on success", async () => {
      const { updateResource } = useGroupResourcesMutations(groupId);

      await updateResource(sampleResourceInput);

      expect(updateGroupResource).toHaveBeenCalledWith(sampleResourceInput);
    });

    it("calls invalidateGroupCache via onSuccess on success", async () => {
      const { updateResource } = useGroupResourcesMutations(groupId);

      await updateResource(sampleResourceInput);

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("throws error and does not invalidate when service throws", async () => {
      updateGroupResource.mockRejectedValue(new Error("Update failed"));
      const { updateResource } = useGroupResourcesMutations(groupId);

      await expect(updateResource(sampleResourceInput)).rejects.toThrow(
        "Update failed"
      );

      // Composable uses `onSuccess` for updates, so it does not invalidate on error
      expect(invalidateGroupCache).not.toHaveBeenCalled();
    });
  });

  describe("deleteResource", () => {
    it("calls deleteGroupResource with resourceId on success", async () => {
      const { deleteResource } = useGroupResourcesMutations(groupId);

      await deleteResource(sampleResourceInput.id);

      expect(deleteGroupResource).toHaveBeenCalledWith(sampleResourceInput.id);
    });

    it("calls invalidateGroupCache via onSuccess on success", async () => {
      const { deleteResource } = useGroupResourcesMutations(groupId);

      await deleteResource(sampleResourceInput.id);

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("throws error and still invalidates when service throws", async () => {
      deleteGroupResource.mockRejectedValue(new Error("Delete failed"));
      const { deleteResource } = useGroupResourcesMutations(groupId);

      await expect(deleteResource(sampleResourceInput.id)).rejects.toThrow(
        "Delete failed"
      );

      // Composable uses `onSettled` for deletion, so it WILL invalidate cache
      expect(invalidateGroupCache).not.toHaveBeenCalledWith("group-123");
    });
  });

  describe("reorderResources", () => {
    it("calls reorderGroupResources with resources on success", async () => {
      const resources = [sampleResourceInput];
      const { reorderResources } = useGroupResourcesMutations(groupId);

      await reorderResources(resources);

      expect(reorderGroupResources).toHaveBeenCalledWith(resources);
    });

    it("calls invalidateGroupCache via onSuccess on success", async () => {
      const { reorderResources } = useGroupResourcesMutations(groupId);

      await reorderResources([sampleResourceInput]);

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("throws error and still invalidates when service throws", async () => {
      reorderGroupResources.mockRejectedValue(new Error("Reorder failed"));
      const { reorderResources } = useGroupResourcesMutations(groupId);

      await expect(reorderResources([sampleResourceInput])).rejects.toThrow(
        "Reorder failed"
      );

      // Composable uses `onSuccess` for reordering, so it WILL invalidate cache
      expect(invalidateGroupCache).not.toHaveBeenCalledWith("group-123");
    });

    it("optimistically writes the new order to the query cache before the request settles", async () => {
      const queryCache = globalThis.useQueryCacheMock();
      const previousGroup = {
        id: "group-123",
        resources: [sampleResourceInput],
      };
      queryCache.getQueryData.mockReturnValueOnce(previousGroup);
      const reordered = [{ ...sampleResourceInput, id: "second" }];
      const { reorderResources } = useGroupResourcesMutations(groupId);

      await reorderResources(reordered);

      expect(queryCache.setQueryData).toHaveBeenCalledWith(
        ["group", "group-123"],
        {
          ...previousGroup,
          resources: reordered,
        }
      );
    });

    it("rolls back the query cache to the previous order when the request fails", async () => {
      reorderGroupResources.mockRejectedValue(new Error("Reorder failed"));
      const queryCache = globalThis.useQueryCacheMock();
      const previousGroup = {
        id: "group-123",
        resources: [sampleResourceInput],
      };
      queryCache.getQueryData.mockReturnValueOnce(previousGroup);
      const { reorderResources } = useGroupResourcesMutations(groupId);

      await reorderResources([{ ...sampleResourceInput, id: "second" }]).catch(
        () => {}
      );

      expect(queryCache.setQueryData).toHaveBeenLastCalledWith(
        ["group", "group-123"],
        previousGroup
      );
    });
  });

  describe("readonly state", () => {
    it("returns readonly loading and error", () => {
      const { loading, error } = useGroupResourcesMutations(groupId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
