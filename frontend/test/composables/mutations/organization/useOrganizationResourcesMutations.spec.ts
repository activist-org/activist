// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useOrganizationResourcesMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useOrganizationResourcesMutations } from "../../../../app/composables/mutations";
import { sampleResourceInput, setupMutationMocks } from "../setup";

const {
  showToastError,
  createOrganizationResource,
  updateOrganizationResource,
  deleteOrganizationResource,
  reorderOrganizationResources,
  invalidateOrganizationCache,
} = vi.hoisted(() => ({
  invalidateOrganizationCache: vi.fn(),
  showToastError: vi.fn(),
  createOrganizationResource: vi.fn(),
  updateOrganizationResource: vi.fn(),
  deleteOrganizationResource: vi.fn(),
  reorderOrganizationResources: vi.fn(),
}));

vi.mock("../../../../app/services/communities/organization/resource", () => ({
  createOrganizationResource: (...args: unknown[]) =>
    createOrganizationResource(...args),
  updateOrganizationResource: (...args: unknown[]) =>
    updateOrganizationResource(...args),
  deleteOrganizationResource: (...args: unknown[]) =>
    deleteOrganizationResource(...args),
  reorderOrganizationResources: (...args: unknown[]) =>
    reorderOrganizationResources(...args),
}));

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

vi.mock("../../../../app/composables/cache/useOrganizationCache", () => ({
  useOrganizationCache: () => ({ invalidateOrganizationCache }),
}));

describe("useOrganizationResourcesMutations", () => {
  const orgId = ref("org-123");

  beforeEach(() => {
    orgId.value = "org-123";
    setupMutationMocks([
      createOrganizationResource,
      updateOrganizationResource,
      deleteOrganizationResource,
      reorderOrganizationResources,
      invalidateOrganizationCache,
    ]);
  });

  describe("createResource", () => {
    it("calls createOrganizationResource with orgId and resourceData on success", async () => {
      const { createResource } = useOrganizationResourcesMutations(orgId);

      await createResource(sampleResourceInput);

      expect(createOrganizationResource).toHaveBeenCalledWith(
        "org-123",
        expect.objectContaining(sampleResourceInput)
      );
    });

    it("calls invalidateOrganizationCache via onSuccess on success", async () => {
      const { createResource } = useOrganizationResourcesMutations(orgId);

      await createResource(sampleResourceInput);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("rejects and does not invalidate cache when service throws", async () => {
      createOrganizationResource.mockRejectedValue(new Error("Create failed"));
      const { createResource } = useOrganizationResourcesMutations(orgId);

      await expect(createResource(sampleResourceInput)).rejects.toThrow(
        "Create failed"
      );

      expect(invalidateOrganizationCache).not.toHaveBeenCalled();
    });
  });

  describe("updateResource", () => {
    it("calls updateOrganizationResource with orgId and resource on success", async () => {
      const { updateResource } = useOrganizationResourcesMutations(orgId);

      await updateResource(sampleResourceInput);

      expect(updateOrganizationResource).toHaveBeenCalledWith(
        "org-123",
        sampleResourceInput
      );
    });

    it("calls invalidateOrganizationCache via onSuccess on success", async () => {
      const { updateResource } = useOrganizationResourcesMutations(orgId);

      await updateResource(sampleResourceInput);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("rejects and does not invalidate cache when service throws", async () => {
      updateOrganizationResource.mockRejectedValue(new Error("Update failed"));
      const { updateResource } = useOrganizationResourcesMutations(orgId);

      await expect(updateResource(sampleResourceInput)).rejects.toThrow(
        "Update failed"
      );

      expect(invalidateOrganizationCache).not.toHaveBeenCalled();
    });
  });

  describe("deleteResource", () => {
    it("calls deleteOrganizationResource with resourceId on success", async () => {
      const { deleteResource } = useOrganizationResourcesMutations(orgId);

      await deleteResource(sampleResourceInput.id);

      expect(deleteOrganizationResource).toHaveBeenCalledWith(
        sampleResourceInput.id
      );
    });

    it("calls invalidateOrganizationCache via onSuccess on success", async () => {
      const { deleteResource } = useOrganizationResourcesMutations(orgId);

      await deleteResource(sampleResourceInput.id);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("rejects and does not invalidate cache when service throws", async () => {
      deleteOrganizationResource.mockRejectedValue(new Error("Delete failed"));
      const { deleteResource } = useOrganizationResourcesMutations(orgId);

      await expect(deleteResource(sampleResourceInput.id)).rejects.toThrow(
        "Delete failed"
      );

      expect(invalidateOrganizationCache).not.toHaveBeenCalled();
    });
  });

  describe("reorderResources", () => {
    it("calls reorderOrganizationResources with orgId and resources on success", async () => {
      const resources = [sampleResourceInput];
      const { reorderResources } = useOrganizationResourcesMutations(orgId);

      await reorderResources(resources);

      expect(reorderOrganizationResources).toHaveBeenCalledWith(
        "org-123",
        resources
      );
    });

    it("calls invalidateOrganizationCache via onSuccess on success", async () => {
      const { reorderResources } = useOrganizationResourcesMutations(orgId);

      await reorderResources([sampleResourceInput]);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("rejects and does not invalidate cache when service throws", async () => {
      reorderOrganizationResources.mockRejectedValue(
        new Error("Reorder failed")
      );
      const { reorderResources } = useOrganizationResourcesMutations(orgId);

      await expect(reorderResources([sampleResourceInput])).rejects.toThrow(
        "Reorder failed"
      );

      expect(invalidateOrganizationCache).not.toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("returns readonly loading and error", () => {
      const { loading, error } = useOrganizationResourcesMutations(orgId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
