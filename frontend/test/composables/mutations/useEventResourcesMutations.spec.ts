// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useEventResourcesMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useEventResourcesMutations } from "../../../app/composables/mutations/useEventResourcesMutations";
import { getKeyForGetEvent } from "../../../app/composables/queries/useGetEvent";
import { sampleResourceInput, setupMutationMocks } from "./setup";

const {
  mockRefreshNuxtData,
  showToastError,
  createEventResource,
  updateEventResource,
  deleteEventResource,
  reorderEventResources,
} = vi.hoisted(() => ({
  mockRefreshNuxtData: vi.fn().mockResolvedValue(undefined),
  showToastError: vi.fn(),
  createEventResource: vi.fn(),
  updateEventResource: vi.fn(),
  deleteEventResource: vi.fn(),
  reorderEventResources: vi.fn(),
}));

vi.mock("../../../app/services/event/resource", () => ({
  createEventResource: (...args: unknown[]) => createEventResource(...args),
  updateEventResource: (...args: unknown[]) => updateEventResource(...args),
  deleteEventResource: (...args: unknown[]) => deleteEventResource(...args),
  reorderEventResources: (...args: unknown[]) => reorderEventResources(...args),
}));

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

mockNuxtImport("refreshNuxtData", () => mockRefreshNuxtData);

describe("useEventResourcesMutations", () => {
  const eventId = ref("event-123");

  beforeEach(() => {
    eventId.value = "event-123";
    setupMutationMocks([
      mockRefreshNuxtData,
      createEventResource,
      updateEventResource,
      deleteEventResource,
      reorderEventResources,
    ]);
  });

  describe("createResource", () => {
    it("calls createEventResource with eventId and resourceData on success", async () => {
      const { createResource } = useEventResourcesMutations(eventId);

      const result = await createResource(sampleResourceInput);

      expect(createEventResource).toHaveBeenCalledWith(
        "event-123",
        expect.objectContaining(sampleResourceInput)
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { createResource } = useEventResourcesMutations(eventId);

      await createResource(sampleResourceInput);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("sets loading true then false", async () => {
      const { createResource, loading } = useEventResourcesMutations(eventId);

      const promise = createResource(sampleResourceInput);
      expect(loading.value).toBe(true);
      await promise;
      expect(loading.value).toBe(false);
    });

    it("returns false when eventId is empty", async () => {
      eventId.value = "";
      const { createResource } = useEventResourcesMutations(eventId);

      const result = await createResource(sampleResourceInput);

      expect(result).toBe(false);
      expect(createEventResource).not.toHaveBeenCalled();
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      createEventResource.mockRejectedValue(new Error("Create failed"));
      const { createResource, error } = useEventResourcesMutations(eventId);

      const result = await createResource(sampleResourceInput);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });

    it("returns false when service rejects invalid resource data", async () => {
      const badResource = { ...sampleResourceInput, name: "" };
      createEventResource.mockRejectedValue(new Error("Invalid resource data"));
      const { createResource, error } = useEventResourcesMutations(eventId);

      const result = await createResource(badResource);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
    });
  });

  describe("updateResource", () => {
    it("calls updateEventResource with eventId and resource on success", async () => {
      const { updateResource } = useEventResourcesMutations(eventId);

      const result = await updateResource(sampleResourceInput);

      expect(updateEventResource).toHaveBeenCalledWith(
        "event-123",
        sampleResourceInput
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { updateResource } = useEventResourcesMutations(eventId);

      await updateResource(sampleResourceInput);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      updateEventResource.mockRejectedValue(new Error("Update failed"));
      const { updateResource, error } = useEventResourcesMutations(eventId);

      const result = await updateResource(sampleResourceInput);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("deleteResource", () => {
    it("calls deleteEventResource with resourceId on success", async () => {
      const { deleteResource } = useEventResourcesMutations(eventId);

      const result = await deleteResource(sampleResourceInput.id);

      expect(deleteEventResource).toHaveBeenCalledWith(sampleResourceInput.id);
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { deleteResource } = useEventResourcesMutations(eventId);

      await deleteResource(sampleResourceInput.id);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      deleteEventResource.mockRejectedValue(new Error("Delete failed"));
      const { deleteResource, error } = useEventResourcesMutations(eventId);

      const result = await deleteResource(sampleResourceInput.id);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("reorderResources", () => {
    it("calls reorderEventResources with eventId and resources on success", async () => {
      const resources = [sampleResourceInput];
      const { reorderResources } = useEventResourcesMutations(eventId);

      const result = await reorderResources(resources);

      expect(reorderEventResources).toHaveBeenCalledWith(
        "event-123",
        resources
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { reorderResources } = useEventResourcesMutations(eventId);

      await reorderResources([sampleResourceInput]);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      reorderEventResources.mockRejectedValue(new Error("Reorder failed"));
      const { reorderResources, error } = useEventResourcesMutations(eventId);

      const result = await reorderResources([sampleResourceInput]);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("refreshEventData", () => {
    it("calls refreshNuxtData with getKeyForGetEvent(id)", async () => {
      const { refreshEventData } = useEventResourcesMutations(eventId);

      await refreshEventData();

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("no-ops when eventId is empty", async () => {
      eventId.value = "";
      const { refreshEventData } = useEventResourcesMutations(eventId);

      await refreshEventData();

      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("returns readonly loading and error", () => {
      const { loading, error } = useEventResourcesMutations(eventId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
