// SPDX-License-Identifier: AGPL-3.0-or-later

import type { EntryKey } from "@pinia/colada";

export function useCustomQuery<ReturnTypeOfQuery>(
  key: MaybeRef<EntryKey>,
  query: () => Promise<ReturnTypeOfQuery>,
  enabled?: MaybeRefOrGetter<boolean>
) {


  const { data, isLoading, error, refresh } = useQuery({
    key: () => unref(key),
    query: query,
    /* 
    If the 'enabled' parameter is not passed into useCustomQuery, 
    then don't pass 'enabled' into the underlying useQuery call.
    */
    ...(enabled !== undefined ? { enabled } : {})
  });

  const { handleError, error: appError } = useAppError();

  watch(error, (err) => {
    if (err) {
      handleError(err);
    }
  });

  return {
    data: data,
    pending: isLoading,
    error: appError,
    refresh: refresh ?? (() => {}),
  };
}
