// SPDX-License-Identifier: AGPL-3.0-or-later
// MARK: Centralized Query Keys

const EVENT_KEYS = {
  root: ["event"] as const,
  byId: (id: string) => [...EVENT_KEYS.root, id] as const,
  list: (filters: unknown) =>
    [...EVENT_KEYS.root, "list", { filters }] as const,
};

export const useEventCache = () => {
  const { invalidateQueries, getEntries } = useQueryCache();

  // Invalidate a single event by ID.
  const invalidateEventCache = async (eventId: string) => {
    await invalidateQueries({
      key: EVENT_KEYS.byId(eventId),
    });
  };

  // Invalidate all event lists (useful when creating or deleting an event).
  const invalidateEventList = async () => {
    await invalidateQueries({
      key: [...EVENT_KEYS.root, "list"],
    });
  };

  // Get cache entries for a single event.
  const eventCacheEntries = (eventId: string) =>
    getEntries({ key: EVENT_KEYS.byId(eventId) });
  const getKeyForEvents = (filters: unknown) => EVENT_KEYS.list(filters);
  const getKeyForEvent = (eventId: string) => EVENT_KEYS.byId(eventId);

  return {
    invalidateEventCache,
    invalidateEventList,
    eventCacheEntries,
    getKeyForEvents,
    getKeyForEvent,
  };
};
