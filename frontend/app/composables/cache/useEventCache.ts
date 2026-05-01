// SPDX-License-Identifier: AGPL-3.0-or-later
export const useEventCache = () => {
  const { invalidateQueries, getEntries } = useQueryCache();

  const invalidateEventCache = async (eventId: string) => {
    await invalidateQueries({
      key: EVENT_KEYS.byId(eventId),
    });
  }
  const eventCacheEntries = (eventId: string) => getEntries({ key: EVENT_KEYS.byId(eventId) });
  return { invalidateEventCache, eventCacheEntries };
}
