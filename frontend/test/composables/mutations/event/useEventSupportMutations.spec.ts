// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useEventSupportMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useEventSupportMutations } from "../../../../app/composables/mutations";
import { setupMutationMocks } from "../setup";

// MARK: Hoisted Mocks

const {
  createEventSupport,
  deleteEventSupport,
  invalidateEventCache,
  invalidateUserCache,
} = vi.hoisted(() => ({
  createEventSupport: vi.fn(),
  deleteEventSupport: vi.fn(),
  invalidateEventCache: vi.fn(),
  invalidateUserCache: vi.fn(),
}));

// MARK: Module Mocks

vi.mock("../../../../app/services/event/support", () => ({
  createEventSupport: (...args: unknown[]) => createEventSupport(...args),
  deleteEventSupport: (...args: unknown[]) => deleteEventSupport(...args),
}));

vi.mock("../../../../app/composables/cache/useEventCache", () => ({
  useEventCache: () => ({
    invalidateEventCache,
    getKeyForEvent: (id: string) => ["event", id],
  }),
}));

vi.mock("../../../../app/composables/cache/useUserCache", () => ({
  useUserCache: () => ({ invalidateUserCache }),
}));

// MARK: Tests

describe("useEventSupportMutations", () => {
  const eventId = ref("event-123");

  beforeEach(() => {
    eventId.value = "event-123";
    setupMutationMocks([
      createEventSupport,
      deleteEventSupport,
      invalidateEventCache,
      invalidateUserCache,
    ]);
  });

  describe("createSupport", () => {
    it("calls createEventSupport with eventId on success", async () => {
      const { createSupport } = useEventSupportMutations(eventId);

      await createSupport();

      expect(createEventSupport).toHaveBeenCalledWith("event-123");
    });

    it("invalidates the event and user cache on success", async () => {
      const { createSupport } = useEventSupportMutations(eventId);

      await createSupport();

      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
      expect(invalidateUserCache).toHaveBeenCalled();
    });

    it("does not call createEventSupport when eventId is empty", async () => {
      eventId.value = "";
      const { createSupport } = useEventSupportMutations(eventId);

      await createSupport();

      expect(createEventSupport).not.toHaveBeenCalled();
    });

    it("optimistically increments the supporter count before the request settles", async () => {
      const queryCache = globalThis.useQueryCacheMock();
      const previousEvent = {
        id: "event-123",
        supporterCount: 1,
        isSupportedByUser: false,
      };
      queryCache.getQueryData.mockReturnValueOnce(previousEvent);
      const { createSupport } = useEventSupportMutations(eventId);

      await createSupport();

      expect(queryCache.setQueryData).toHaveBeenCalledWith(
        ["event", "event-123"],
        {
          ...previousEvent,
          supporterCount: 2,
          isSupportedByUser: true,
        }
      );
    });

    it("rolls back the query cache and does not invalidate when the request fails", async () => {
      createEventSupport.mockRejectedValue(new Error("Create failed"));
      const queryCache = globalThis.useQueryCacheMock();
      const previousEvent = {
        id: "event-123",
        supporterCount: 1,
        isSupportedByUser: false,
      };
      queryCache.getQueryData.mockReturnValueOnce(previousEvent);
      const { createSupport } = useEventSupportMutations(eventId);

      await createSupport().catch(() => {});

      expect(queryCache.setQueryData).toHaveBeenLastCalledWith(
        ["event", "event-123"],
        previousEvent
      );
      expect(invalidateEventCache).not.toHaveBeenCalled();
    });
  });

  describe("deleteSupport", () => {
    it("calls deleteEventSupport with eventId on success", async () => {
      const { deleteSupport } = useEventSupportMutations(eventId);

      await deleteSupport();

      expect(deleteEventSupport).toHaveBeenCalledWith("event-123");
    });

    it("invalidates the event and user cache on success", async () => {
      const { deleteSupport } = useEventSupportMutations(eventId);

      await deleteSupport();

      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
      expect(invalidateUserCache).toHaveBeenCalled();
    });

    it("does not call deleteEventSupport when eventId is empty", async () => {
      eventId.value = "";
      const { deleteSupport } = useEventSupportMutations(eventId);

      await deleteSupport();

      expect(deleteEventSupport).not.toHaveBeenCalled();
    });

    it("optimistically decrements the supporter count before the request settles", async () => {
      const queryCache = globalThis.useQueryCacheMock();
      const previousEvent = {
        id: "event-123",
        supporterCount: 2,
        isSupportedByUser: true,
      };
      queryCache.getQueryData.mockReturnValueOnce(previousEvent);
      const { deleteSupport } = useEventSupportMutations(eventId);

      await deleteSupport();

      expect(queryCache.setQueryData).toHaveBeenCalledWith(
        ["event", "event-123"],
        {
          ...previousEvent,
          supporterCount: 1,
          isSupportedByUser: false,
        }
      );
    });

    it("rolls back the query cache and does not invalidate when the request fails", async () => {
      deleteEventSupport.mockRejectedValue(new Error("Delete failed"));
      const queryCache = globalThis.useQueryCacheMock();
      const previousEvent = {
        id: "event-123",
        supporterCount: 2,
        isSupportedByUser: true,
      };
      queryCache.getQueryData.mockReturnValueOnce(previousEvent);
      const { deleteSupport } = useEventSupportMutations(eventId);

      await deleteSupport().catch(() => {});

      expect(queryCache.setQueryData).toHaveBeenLastCalledWith(
        ["event", "event-123"],
        previousEvent
      );
      expect(invalidateEventCache).not.toHaveBeenCalled();
    });
  });

  describe("loading state", () => {
    it("returns a loading ref", () => {
      const { loading } = useEventSupportMutations(eventId);

      expect(loading).toBeDefined();
      expect(typeof loading.value).toBe("boolean");
    });
  });
});
