// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useEventMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useEventMutations } from "../../../../app/composables/mutations";
import { setupMutationMocks } from "../setup";

const sampleEventInput = {
  name: "Test Event",
  tagline: "A tagline",
  location: "Berlin",
  description: "A description",
  topics: [],
} as never;

const { showToastError, createEvent } = vi.hoisted(() => ({
  showToastError: vi.fn(),
  createEvent: vi.fn(),
}));

vi.mock("../../../../app/services/event/event", () => ({
  createEvent: (...args: unknown[]) => createEvent(...args),
}));

vi.mock("../../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

const mockInvalidateEventList = vi.fn();
// The events list is refreshed.
vi.mock("../../../../app/composables/cache/useEventCache", () => ({
  useEventCache: () => ({
    invalidateEventList: mockInvalidateEventList,
  }),
}));

describe("useEventMutations", () => {
  beforeEach(() => {
    setupMutationMocks([mockInvalidateEventList, createEvent]);
    createEvent.mockResolvedValue({ id: "event-123" });
  });

  describe("create", () => {
    it("calls createEvent with the form data and returns the event", async () => {
      const { create } = useEventMutations();

      const result = await create(sampleEventInput);

      expect(createEvent).toHaveBeenCalledWith(sampleEventInput);
      expect(result).toEqual({ id: "event-123" });
    });

    it("refreshes the event list via onSettled on success", async () => {
      const { create } = useEventMutations();

      create(sampleEventInput);

      await vi.waitFor(() => {
        expect(mockInvalidateEventList).toHaveBeenCalled();
      });
    });

    it("rejects when the service fails", async () => {
      createEvent.mockRejectedValue(new Error("Create failed"));
      const { create, error } = useEventMutations();

      // Unlike the organization and group create, this one is a raw mutate
      // and rejects, so ModalCreateEvent has to catch rather than branch.
      await expect(create(sampleEventInput)).rejects.toThrow("Create failed");

      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
    });
  });
});
