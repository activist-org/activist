// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useEventResourcesMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useEventResourcesMutations } from "../../../app/composables/mutations/useEventResourcesMutations";
import { sampleResourceInput, setupMutationMocks } from "./setup";

// MARK: Hoisted Mocks

const {
  showToastError,
  createEventResource,
  updateEventResource,
  deleteEventResource,
  reorderEventResources,
  invalidateEventCache,
} = vi.hoisted(() => ({
  showToastError: vi.fn(),
  createEventResource: vi.fn(),
  updateEventResource: vi.fn(),
  deleteEventResource: vi.fn(),
  reorderEventResources: vi.fn(),
  invalidateEventCache: vi.fn(),
}));

// MARK: Module Mocks

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

vi.mock("../../../app/composables/cache/useEventCache", () => ({
  useEventCache: () => ({ invalidateEventCache }),
}));

// MARK: Tests

describe("useEventResourcesMutations", () => {
  const eventId = ref("event-123");

  beforeEach(() => {
    eventId.value = "event-123";
    setupMutationMocks([
      createEventResource,
      updateEventResource,
      deleteEventResource,
      reorderEventResources,
      invalidateEventCache,
    ]);
    showToastError.mockReset();
  });

  describe("createResource", () => {
    it("calls createEventResource with eventId and resourceData on success", async () => {
      createEventResource.mockResolvedValue(undefined);
      const { createResource } = useEventResourcesMutations(eventId);

      await createResource(sampleResourceInput);

      expect(createEventResource).toHaveBeenCalledWith(
        "event-123",
        expect.objectContaining(sampleResourceInput)
      );
    });

    it("calls invalidateEventCache via onSettled on success", async () => {
      createEventResource.mockResolvedValue(undefined);
      const { createResource } = useEventResourcesMutations(eventId);

      await createResource(sampleResourceInput);

      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
    });

    it("calls handleError (showToastError) via onError when service throws", async () => {
      createEventResource.mockRejectedValue(new Error("Create failed"));
      const { createResource } = useEventResourcesMutations(eventId);

      await createResource(sampleResourceInput).catch(() => {});

      expect(showToastError).toHaveBeenCalled();
    });

    it("calls handleError (showToastError) when service rejects invalid resource data", async () => {
      createEventResource.mockRejectedValue(new Error("Invalid resource data"));
      const { createResource } = useEventResourcesMutations(eventId);

      await createResource({ ...sampleResourceInput, name: "" }).catch(
        () => {}
      );

      expect(showToastError).toHaveBeenCalled();
    });
  });

  describe("updateResource", () => {
    it("calls updateEventResource with eventId and resource on success", async () => {
      updateEventResource.mockResolvedValue(undefined);
      const { updateResource } = useEventResourcesMutations(eventId);

      await updateResource(sampleResourceInput);

      expect(updateEventResource).toHaveBeenCalledWith(
        "event-123",
        sampleResourceInput
      );
    });

    it("calls invalidateEventCache via onSettled on success", async () => {
      updateEventResource.mockResolvedValue(undefined);
      const { updateResource } = useEventResourcesMutations(eventId);

      await updateResource(sampleResourceInput);

      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
    });

    it("calls handleError (showToastError) via onError when service throws", async () => {
      updateEventResource.mockRejectedValue(new Error("Update failed"));
      const { updateResource } = useEventResourcesMutations(eventId);

      await updateResource(sampleResourceInput).catch(() => {});

      expect(showToastError).toHaveBeenCalled();
    });
  });

  describe("deleteResource", () => {
    it("calls deleteEventResource with resourceId on success", async () => {
      deleteEventResource.mockResolvedValue(undefined);
      const { deleteResource } = useEventResourcesMutations(eventId);

      await deleteResource(sampleResourceInput.id);

      expect(deleteEventResource).toHaveBeenCalledWith(sampleResourceInput.id);
    });

    it("calls invalidateEventCache via onSettled on success", async () => {
      deleteEventResource.mockResolvedValue(undefined);
      const { deleteResource } = useEventResourcesMutations(eventId);

      await deleteResource(sampleResourceInput.id);

      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
    });

    it("calls handleError (showToastError) via onError when service throws", async () => {
      deleteEventResource.mockRejectedValue(new Error("Delete failed"));
      const { deleteResource } = useEventResourcesMutations(eventId);

      await deleteResource(sampleResourceInput.id).catch(() => {});

      expect(showToastError).toHaveBeenCalled();
    });
  });

  describe("reorderResources", () => {
    it("calls reorderEventResources with eventId and resources on success", async () => {
      reorderEventResources.mockResolvedValue(undefined);
      const { reorderResources } = useEventResourcesMutations(eventId);

      await reorderResources([sampleResourceInput]);

      expect(reorderEventResources).toHaveBeenCalledWith("event-123", [
        sampleResourceInput,
      ]);
    });

    it("calls invalidateEventCache via onSettled on success", async () => {
      reorderEventResources.mockResolvedValue(undefined);
      const { reorderResources } = useEventResourcesMutations(eventId);

      await reorderResources([sampleResourceInput]);

      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
    });

    it("calls handleError (showToastError) via onError when service throws", async () => {
      reorderEventResources.mockRejectedValue(new Error("Reorder failed"));
      const { reorderResources } = useEventResourcesMutations(eventId);

      await reorderResources([sampleResourceInput]).catch(() => {});

      expect(showToastError).toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("returns loading and error", () => {
      const { loading, error } = useEventResourcesMutations(eventId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
