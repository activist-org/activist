// SPDX-License-Identifier: AGPL-3.0-or-later

export const getKeyForGetEvent = (id: string) => `event:${id}`;

/**
 * Composable for fetching and managing the data of a specific event in the frontend application. This composable uses the useAsyncData hook to fetch the event's data from the server based on the provided event ID, handle loading and error states, and cache the data for efficient retrieval. The fetched event data is stored in a Vuex store using the useEventStore composable, allowing other components to access and reactively update based on the event's data. The composable also integrates error handling using the useAppError composable to manage any errors that occur during the data fetching process. Additionally, it provides a refresh function to manually trigger a re-fetch of the event's data when needed.
 * @param id A reactive reference containing the ID of the event to be fetched, allowing the composable to reactively update the fetched data based on changes to the event ID.
 * @returns An object containing the data (event), pending state, error state, and a refresh function for managing the fetching and state of an event in the application.
 */
export function useGetEvent(id: MaybeRef<string>) {
  const { handleError } = useAppError();
  const eventId = computed(() => String(unref(id)));
  const store = useEventStore();

  // Cache key for useAsyncData.
  const key = computed(() =>
    eventId.value ? getKeyForGetEvent(eventId.value) : null
  );

  const query = useAsyncData(
    getKeyForGetEvent(eventId.value),
    async () => {
      if (!eventId.value || eventId.value === "") return null;
      try {
        const event = await getEvent(eventId.value);
        // Cache the result in store.
        store.setEvent(event);
        return event as CommunityEvent;
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    {
      watch: [eventId],
      immediate: true,
      dedupe: "defer",
      getCachedData: (key, nuxtApp) => {
        if (
          nuxtApp.isHydrating &&
          store.getEvent() &&
          store.getEvent().id !== "" &&
          store.getEvent().id === eventId.value
        ) {
          return store.getEvent();
        }
        return nuxtApp.isHydrating
          ? nuxtApp.payload.data[key]
          : nuxtApp.static.data[key];
      },
    }
  );

  // Return cached data if available, otherwise data from useAsyncData.
  const data = computed<CommunityEvent | null>(
    () => query.data.value as CommunityEvent | null
  );

  // Only show pending when we're actually fetching (not when using cache).
  const pending = computed(() => query.pending.value);

  /**
   * Refreshes the event data by triggering a re-fetch from the server.
   * This function updates the store with the latest event data.
   */
  async function refresh() {
    if (!key.value) return;
    // Let useAsyncData refetch and update store in the success path above.
    await refreshNuxtData(key.value);
  }

  return {
    data,
    pending,
    error: query.error,
    refresh,
  };
}
