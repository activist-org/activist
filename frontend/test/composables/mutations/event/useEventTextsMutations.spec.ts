// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useEventTextsMutations composable.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useEventTextsMutations } from "../../../../app/composables/mutations";
import { sampleEventTextFormData } from "../setup";

// Hoist specific spies for this test.
const { updateEventTexts, handleErrorMock, invalidateEventCacheMock } =
  vi.hoisted(() => ({
    updateEventTexts: vi.fn(),
    handleErrorMock: vi.fn(),
    invalidateEventCacheMock: vi.fn(),
  }));

// Mock API service.
vi.mock("../../../../app/services/event/text", () => ({
  updateEventTexts: (...args: unknown[]) => updateEventTexts(...args),
}));

// Mock error handler.
vi.mock("../../../../app/composables/generic/useAppError", async () => {
  const { ref } = await import("vue");
  return {
    useAppError: () => ({
      error: ref(null),
      handleError: handleErrorMock,
    }),
  };
});

vi.mock("../../../../app/composables/cache/useEventCache", () => ({
  useEventCache: () => ({
    invalidateEventCache: invalidateEventCacheMock,
  }),
}));

describe("useEventTextsMutations", () => {
  const eventId = ref("event-123");
  const textId = "text-1";

  beforeEach(() => {
    eventId.value = "event-123";
    vi.clearAllMocks();

    // Default success response.
    updateEventTexts.mockResolvedValue({ success: true });
  });

  describe("updateTexts", () => {
    it("calls updateEventTexts with correctly formatted payload on success", async () => {
      const { updateTexts } = useEventTextsMutations(eventId);

      await updateTexts({ textId, data: sampleEventTextFormData });

      expect(updateEventTexts).toHaveBeenCalledWith(
        "event-123",
        textId,
        sampleEventTextFormData
      );
    });

    it("invalidates event cache queries in onSettled", async () => {
      const { updateTexts } = useEventTextsMutations(eventId);

      await updateTexts({ textId, data: sampleEventTextFormData });
      expect(invalidateEventCacheMock).toHaveBeenCalled();
    });

    it("sets loading true then false", async () => {
      const { updateTexts, loading } = useEventTextsMutations(eventId);

      // Trigger mutation without awaiting immediately.
      const promise = updateTexts({ textId, data: sampleEventTextFormData });

      expect(loading.value).toBe(true);

      await promise;

      expect(loading.value).toBe(false);
    });

    it("calls handleError when the service throws an error", async () => {
      const errorInstance = new Error("Update failed");
      updateEventTexts.mockRejectedValue(errorInstance);

      const { updateTexts } = useEventTextsMutations(eventId);

      // We catch it here because the global mock re-throws the error.
      await updateTexts({ textId, data: sampleEventTextFormData }).catch(
        () => {}
      );

      expect(handleErrorMock).toHaveBeenCalledWith(errorInstance);
      // Verify that cache invalidation is not called when the service throws an error.
      expect(invalidateEventCacheMock).not.toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("exposes loading and error as readonly refs", () => {
      const { loading, error } = useEventTextsMutations(eventId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
