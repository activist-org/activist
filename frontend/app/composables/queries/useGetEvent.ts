// SPDX-License-Identifier: AGPL-3.0-or-later
// Read a single event with useAsyncData. Store-first, then fetch if missing.
// After fetch, cache it via store. You can always call refresh() to force refetch.

import type { MaybeRef } from "vue";

import type { Event } from "~/types/events/event";
import type { AppError } from "~/utils/errorHandler";

import { getEvent } from "~/services/event";
import { useEventStore } from "~/stores/event";

export function useGetEvent(id: MaybeRef<string>) {
  const { showToastError } = useToaster();
  const eventId = computed(() => String(unref(id)));
  const store = useEventStore();

  // Cache key for useAsyncData
  const key = computed(() => (eventId.value ? `event:${eventId.value}` : null));

  // Check if we have cached data
  const cached = computed<Event | null>(() =>
    store.getEvent() && store.getEvent().id !== "" ? store.getEvent() : null
  );

  // Only fetch if we have an ID and no cached data
  const shouldFetch = computed(() => !!eventId.value && !cached.value);

  const query = useAsyncData(
    `event:${eventId.value}`,
    async () => {
      if (!eventId.value) return null;

      try {
        const event = await getEvent(eventId.value);
        // Cache the result in store
        store.setEvent(event);
        return event as Event;
      } catch (error) {
        showToastError((error as AppError).message);
        throw error;
      }
    },
    {
      watch: [eventId],
      immediate: shouldFetch.value,
      dedupe: "defer",
      // Don't execute on server if we already have cached data
      server: shouldFetch.value,
    }
  );

  // Return cached data if available, otherwise data from useAsyncData
  const data = computed<Event | null>(() =>
    cached.value && cached.value.id !== ""
      ? cached.value
      : (query.data.value as Event | null)
  );

  // Only show pending when we're actually fetching (not when using cache)
  const pending = computed(() =>
    shouldFetch.value ? query.pending.value : false
  );

  async function refresh() {
    if (!key.value) return;
    // Let useAsyncData refetch and update store in the success path above
    await refreshNuxtData(key.value);
  }

  return {
    data,
    pending,
    error: query.error,
    refresh,
  };
}
