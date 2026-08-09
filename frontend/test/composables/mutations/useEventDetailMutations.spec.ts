// SPDX-License-Identifier: AGPL-3.0-or-later
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useEventDetailMutations } from "../../../app/composables/mutations/useEventDetailMutations";
import { setupMutationMocks } from "./setup";

const { invalidateEventCache, showToastError, updateEvent } = vi.hoisted(
  () => ({
    invalidateEventCache: vi.fn().mockResolvedValue(undefined),
    showToastError: vi.fn(),
    updateEvent: vi.fn(),
  })
);

vi.mock("../../../app/services/event/event", () => ({
  updateEvent: (...args: unknown[]) => updateEvent(...args),
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

describe("useEventDetailMutations", () => {
  const eventId = ref("event-123");

  beforeEach(() => {
    eventId.value = "event-123";
    setupMutationMocks([invalidateEventCache, updateEvent]);
  });

  describe("updateDetails", () => {
    it("calls updateEvent and refreshes event cache on success", async () => {
      updateEvent.mockResolvedValueOnce({ id: "event-123" });

      const { updateDetails } = useEventDetailMutations(eventId);
      const result = await updateDetails({
        orgs: ["org-1"],
        locationType: "online",
        onlineLocationLink: "https://example.com",
      });

      expect(result).toBe(true);
      expect(updateEvent).toHaveBeenCalledWith("event-123", {
        orgs: ["org-1"],
        locationType: "online",
        onlineLocationLink: "https://example.com",
      });
      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
    });

    it("sets loading true then false", async () => {
      const { updateDetails, loading } = useEventDetailMutations(eventId);

      const promise = updateDetails({ orgs: ["org-1"] });
      expect(loading.value).toBe(true);
      await promise;
      expect(loading.value).toBe(false);
    });

    it("returns false when eventId is empty", async () => {
      eventId.value = "";
      const { updateDetails } = useEventDetailMutations(eventId);

      const result = await updateDetails({ orgs: ["org-1"] });

      expect(result).toBe(false);
      expect(updateEvent).not.toHaveBeenCalled();
    });

    it("returns false, sets error, and does not refresh when service throws", async () => {
      updateEvent.mockRejectedValueOnce(new Error("Update failed"));
      const { updateDetails, error } = useEventDetailMutations(eventId);

      const result = await updateDetails({ orgs: ["org-1"] });

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(invalidateEventCache).not.toHaveBeenCalled();
    });
  });

  describe("refreshEventData", () => {
    it("calls invalidateEventCache with the event id", async () => {
      const { refreshEventData } = useEventDetailMutations(eventId);

      await refreshEventData();

      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
    });

    it("no-ops when eventId is empty", async () => {
      eventId.value = "";
      const { refreshEventData } = useEventDetailMutations(eventId);

      await refreshEventData();

      expect(invalidateEventCache).not.toHaveBeenCalled();
    });
  });
});
