// SPDX-License-Identifier: AGPL-3.0-or-later
import type { EntryKey } from "@pinia/colada";

export interface UseCustomQueryOptions {
  enabled?: MaybeRefOrGetter<boolean>;
}

/**
 * Shared wrapper around Pinia Colada's `useQuery` that standardizes
 * error handling via `useAppError` and normalizes the returned state.
 */
export function useCustomQuery<T>(
  key: MaybeRefOrGetter<EntryKey>,
  query: () => Promise<T>,
  options: UseCustomQueryOptions = {}
) {
  const { handleError, error: appError } = useAppError();

  const { data, isLoading, error, refresh } = useQuery({
    key: () => toValue(key),
    query,
    ...(options.enabled !== undefined ? { enabled: options.enabled } : {}),
  });

  watch(error, (err) => {
    if (err) {
      handleError(err);
    }
  });

  return {
    data,
    pending: readonly(isLoading),
    error: appError,
    refresh: refresh ?? (() => {}),
  };
}
