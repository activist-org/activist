// SPDX-License-Identifier: AGPL-3.0-or-later
// Read a single event with useAsyncData. Store-first, then fetch if missing.
// After fetch, cache it via store. You can always call refresh() to force refetch.

import { useQuery } from "@pinia/colada";

export const EVENT_KEYS = {
  root: ["event"] as const,
  byId: (id: string) => [...EVENT_KEYS.root, id] as const,
};

export const getKeyForGetEvent = (id: string) => `event:${id}`;

export function useGetEvent(id: MaybeRef<string>) {
  const eventId = computed(() => String(unref(id)));
  const enabled = computed(() => !!eventId.value);

  const { data, isLoading, error, refresh } = useQuery({
    key: () => EVENT_KEYS.byId(eventId.value),
    query: () => getEvent(eventId.value),
    enabled,
  });
  const { handleError } = useAppError();
  const err = computed(() => (error.value ? handleError(error.value) : null));

  return { data, pending: isLoading, error: err, refresh };
}
