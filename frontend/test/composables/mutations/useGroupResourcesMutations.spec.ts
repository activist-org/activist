// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGroupResourcesMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useGroupResourcesMutations } from "../../../app/composables/mutations/useGroupResourcesMutations";
import { getKeyForGetGroup } from "../../../app/composables/queries/useGetGroup";
import { sampleResourceInput, setupMutationMocks } from "./setup";

const {
  mockRefreshNuxtData,
  showToastError,
  createGroupResource,
  updateGroupResource,
  deleteGroupResource,
  reorderGroupResources,
} = vi.hoisted(() => ({
  mockRefreshNuxtData: vi.fn().mockResolvedValue(undefined),
  showToastError: vi.fn(),
  createGroupResource: vi.fn(),
  updateGroupResource: vi.fn(),
  deleteGroupResource: vi.fn(),
  reorderGroupResources: vi.fn(),
}));

vi.mock("../../../app/services/communities/group/resource", () => ({
  createGroupResource: (...args: unknown[]) => createGroupResource(...args),
  updateGroupResource: (...args: unknown[]) => updateGroupResource(...args),
  deleteGroupResource: (...args: unknown[]) => deleteGroupResource(...args),
  reorderGroupResources: (...args: unknown[]) => reorderGroupResources(...args),
}));

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

mockNuxtImport("refreshNuxtData", () => mockRefreshNuxtData);

describe("useGroupResourcesMutations", () => {
  const groupId = ref("group-123");

  beforeEach(() => {
    groupId.value = "group-123";
    setupMutationMocks([
      mockRefreshNuxtData,
      createGroupResource,
      updateGroupResource,
      deleteGroupResource,
      reorderGroupResources,
    ]);
  });

  describe("createResource", () => {
    it("calls createGroupResource with groupId and resourceData on success", async () => {
      const { createResource } = useGroupResourcesMutations(groupId);

      const result = await createResource(sampleResourceInput);

      expect(createGroupResource).toHaveBeenCalledWith(
        "group-123",
        expect.objectContaining(sampleResourceInput)
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { createResource } = useGroupResourcesMutations(groupId);

      await createResource(sampleResourceInput);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetGroup("group-123")
      );
    });

    it("sets loading true then false", async () => {
      const { createResource, loading } = useGroupResourcesMutations(groupId);

      const promise = createResource(sampleResourceInput);
      expect(loading.value).toBe(true);
      await promise;
      expect(loading.value).toBe(false);
    });

    it("returns false when groupId is empty", async () => {
      groupId.value = "";
      const { createResource } = useGroupResourcesMutations(groupId);

      const result = await createResource(sampleResourceInput);

      expect(result).toBe(false);
      expect(createGroupResource).not.toHaveBeenCalled();
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      createGroupResource.mockRejectedValue(new Error("Create failed"));
      const { createResource, error } = useGroupResourcesMutations(groupId);

      const result = await createResource(sampleResourceInput);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });

    it("returns false when service rejects invalid resource data", async () => {
      const badResource = { ...sampleResourceInput, name: "" };
      createGroupResource.mockRejectedValue(new Error("Invalid resource data"));
      const { createResource, error } = useGroupResourcesMutations(groupId);

      const result = await createResource(badResource);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
    });
  });

  describe("updateResource", () => {
    it("calls updateGroupResource with resource on success", async () => {
      const { updateResource } = useGroupResourcesMutations(groupId);

      const result = await updateResource(sampleResourceInput);

      expect(updateGroupResource).toHaveBeenCalledWith(sampleResourceInput);
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { updateResource } = useGroupResourcesMutations(groupId);

      await updateResource(sampleResourceInput);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetGroup("group-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      updateGroupResource.mockRejectedValue(new Error("Update failed"));
      const { updateResource, error } = useGroupResourcesMutations(groupId);

      const result = await updateResource(sampleResourceInput);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("deleteResource", () => {
    it("calls deleteGroupResource with resourceId on success", async () => {
      const { deleteResource } = useGroupResourcesMutations(groupId);

      const result = await deleteResource(sampleResourceInput.id);

      expect(deleteGroupResource).toHaveBeenCalledWith(sampleResourceInput.id);
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { deleteResource } = useGroupResourcesMutations(groupId);

      await deleteResource(sampleResourceInput.id);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetGroup("group-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      deleteGroupResource.mockRejectedValue(new Error("Delete failed"));
      const { deleteResource, error } = useGroupResourcesMutations(groupId);

      const result = await deleteResource(sampleResourceInput.id);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("reorderResources", () => {
    it("calls reorderGroupResources with resources on success", async () => {
      const resources = [sampleResourceInput];
      const { reorderResources } = useGroupResourcesMutations(groupId);

      const result = await reorderResources(resources);

      expect(reorderGroupResources).toHaveBeenCalledWith(resources);
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { reorderResources } = useGroupResourcesMutations(groupId);

      await reorderResources([sampleResourceInput]);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetGroup("group-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      reorderGroupResources.mockRejectedValue(new Error("Reorder failed"));
      const { reorderResources, error } = useGroupResourcesMutations(groupId);

      const result = await reorderResources([sampleResourceInput]);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("refreshGroupData", () => {
    it("calls refreshNuxtData with getKeyForGetGroup(id)", async () => {
      const { refreshGroupData } = useGroupResourcesMutations(groupId);

      await refreshGroupData();

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetGroup("group-123")
      );
    });

    it("no-ops when groupId is empty", async () => {
      groupId.value = "";
      const { refreshGroupData } = useGroupResourcesMutations(groupId);

      await refreshGroupData();

      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
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
