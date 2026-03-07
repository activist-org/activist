// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useOrganizationResourcesMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useOrganizationResourcesMutations } from "../../../app/composables/mutations/useOrganizationResourcesMutations";
import { getKeyForGetOrganization } from "../../../app/composables/queries/useGetOrganization";
import { sampleResourceInput, setupMutationMocks } from "./setup";

const {
  mockRefreshNuxtData,
  showToastError,
  createOrganizationResource,
  updateOrganizationResource,
  deleteOrganizationResource,
  reorderOrganizationResources,
} = vi.hoisted(() => ({
  mockRefreshNuxtData: vi.fn().mockResolvedValue(undefined),
  showToastError: vi.fn(),
  createOrganizationResource: vi.fn(),
  updateOrganizationResource: vi.fn(),
  deleteOrganizationResource: vi.fn(),
  reorderOrganizationResources: vi.fn(),
}));

vi.mock("../../../app/services/communities/organization/resource", () => ({
  createOrganizationResource: (...args: unknown[]) =>
    createOrganizationResource(...args),
  updateOrganizationResource: (...args: unknown[]) =>
    updateOrganizationResource(...args),
  deleteOrganizationResource: (...args: unknown[]) =>
    deleteOrganizationResource(...args),
  reorderOrganizationResources: (...args: unknown[]) =>
    reorderOrganizationResources(...args),
}));

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

mockNuxtImport("refreshNuxtData", () => mockRefreshNuxtData);

describe("useOrganizationResourcesMutations", () => {
  const organizationId = ref("org-123");

  beforeEach(() => {
    organizationId.value = "org-123";
    setupMutationMocks([
      mockRefreshNuxtData,
      createOrganizationResource,
      updateOrganizationResource,
      deleteOrganizationResource,
      reorderOrganizationResources,
    ]);
  });

  describe("createResource", () => {
    it("calls createOrganizationResource with organizationId and resourceData on success", async () => {
      const { createResource } =
        useOrganizationResourcesMutations(organizationId);

      const result = await createResource(sampleResourceInput);

      expect(createOrganizationResource).toHaveBeenCalledWith(
        "org-123",
        expect.objectContaining(sampleResourceInput)
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { createResource } =
        useOrganizationResourcesMutations(organizationId);

      await createResource(sampleResourceInput);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("sets loading true then false", async () => {
      const { createResource, loading } =
        useOrganizationResourcesMutations(organizationId);

      const promise = createResource(sampleResourceInput);
      expect(loading.value).toBe(true);
      await promise;
      expect(loading.value).toBe(false);
    });

    it("returns false when organizationId is empty", async () => {
      organizationId.value = "";
      const { createResource } =
        useOrganizationResourcesMutations(organizationId);

      const result = await createResource(sampleResourceInput);

      expect(result).toBe(false);
      expect(createOrganizationResource).not.toHaveBeenCalled();
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      createOrganizationResource.mockRejectedValue(new Error("Create failed"));
      const { createResource, error } =
        useOrganizationResourcesMutations(organizationId);

      const result = await createResource(sampleResourceInput);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });

    it("returns false when service rejects invalid resource data", async () => {
      const badResource = { ...sampleResourceInput, name: "" };
      createOrganizationResource.mockRejectedValue(
        new Error("Invalid resource data")
      );
      const { createResource, error } =
        useOrganizationResourcesMutations(organizationId);

      const result = await createResource(badResource);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
    });
  });

  describe("updateResource", () => {
    it("calls updateOrganizationResource with organizationId and resource on success", async () => {
      const { updateResource } =
        useOrganizationResourcesMutations(organizationId);

      const result = await updateResource(sampleResourceInput);

      expect(updateOrganizationResource).toHaveBeenCalledWith(
        "org-123",
        sampleResourceInput
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { updateResource } =
        useOrganizationResourcesMutations(organizationId);

      await updateResource(sampleResourceInput);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      updateOrganizationResource.mockRejectedValue(new Error("Update failed"));
      const { updateResource, error } =
        useOrganizationResourcesMutations(organizationId);

      const result = await updateResource(sampleResourceInput);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("deleteResource", () => {
    it("calls deleteOrganizationResource with resourceId on success", async () => {
      const { deleteResource } =
        useOrganizationResourcesMutations(organizationId);

      const result = await deleteResource(sampleResourceInput.id);

      expect(deleteOrganizationResource).toHaveBeenCalledWith(
        sampleResourceInput.id
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { deleteResource } =
        useOrganizationResourcesMutations(organizationId);

      await deleteResource(sampleResourceInput.id);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      deleteOrganizationResource.mockRejectedValue(new Error("Delete failed"));
      const { deleteResource, error } =
        useOrganizationResourcesMutations(organizationId);

      const result = await deleteResource(sampleResourceInput.id);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("reorderResources", () => {
    it("calls reorderOrganizationResources with organizationId and resources on success", async () => {
      const resources = [sampleResourceInput];
      const { reorderResources } =
        useOrganizationResourcesMutations(organizationId);

      const result = await reorderResources(resources);

      expect(reorderOrganizationResources).toHaveBeenCalledWith(
        "org-123",
        resources
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { reorderResources } =
        useOrganizationResourcesMutations(organizationId);

      await reorderResources([sampleResourceInput]);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      reorderOrganizationResources.mockRejectedValue(
        new Error("Reorder failed")
      );
      const { reorderResources, error } =
        useOrganizationResourcesMutations(organizationId);

      const result = await reorderResources([sampleResourceInput]);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("refreshOrganizationData", () => {
    it("calls refreshNuxtData with getKeyForGetOrganization(id)", async () => {
      const { refreshOrganizationData } =
        useOrganizationResourcesMutations(organizationId);

      await refreshOrganizationData();

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("no-ops when organizationId is empty", async () => {
      organizationId.value = "";
      const { refreshOrganizationData } =
        useOrganizationResourcesMutations(organizationId);

      await refreshOrganizationData();

      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("returns readonly loading and error", () => {
      const { loading, error } =
        useOrganizationResourcesMutations(organizationId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
