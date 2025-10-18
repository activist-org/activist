// SPDX-License-Identifier: AGPL-3.0-or-later
// Read a single event with useAsyncData. Store-first, then fetch if missing.
// After fetch, cache it via store. You can always call refresh() to force refetch.

import type { MaybeRef } from "vue";

import type { Event } from "~/types/events/event";
import type { AppError } from "~/utils/errorHandler";

import { getEvent } from "~/services/event/event";
import { useEventStore } from "~/stores/event";

export const getKeyForGetEvent = (id: string) => `event:${id}`;

export function useGetEvent(id: MaybeRef<string>) {
  const { showToastError } = useToaster();
  const eventId = computed(() => String(unref(id)));
  const store = useEventStore();

  // Cache key for useAsyncData.
  const key = computed(() =>
    eventId.value ? getKeyForGetEvent(eventId.value) : null
  );

  const query = useAsyncData(
    getKeyForGetEvent(eventId.value),
    async () => {
      if (!eventId.value && eventId.value === "") return null;
      try {
        const event = await getEvent(eventId.value);
        // Cache the result in store.
        store.setEvent(event);
        return event as Event;
      } catch (error) {
        showToastError((error as AppError).message);
        throw error;
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
  const data = computed<Event | null>(() => query.data.value as Event | null);

  // Only show pending when we're actually fetching (not when using cache).
  const pending = computed(() => query.pending.value);

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
