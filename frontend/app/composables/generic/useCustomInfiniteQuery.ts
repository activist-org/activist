// SPDX-License-Identifier: AGPL-3.0-or-later
import type { EntryKey } from "@pinia/colada";

export function useCustomInfiniteQuery<T>(
  key: MaybeRef<EntryKey>,
  invalidate: () => Promise<void>,
  callback: (params: {
    page: number;
    page_size: number;
  }) => Promise<PaginatedResponse<T>>
) {
  const { handleError, error: appError } = useAppError();

  const { data, isLoading, error, loadNextPage } = useInfiniteQuery({
    initialPageParam: 1,
    key: () => unref(key),
    getNextPageParam: (lastPage: PaginatedResponse<T>, allPages) =>
      lastPage.isLastPage ? null : allPages.length + 1,
    query: ({ pageParam }) => callback({ page: pageParam, page_size: 10 }),
  });

  watch(error, (err) => {
    if (err) handleError(err);
  });

  return {
    data: computed(() =>
      (data.value?.pages ?? []).flatMap((page) => page.data)
    ),
    pending: readonly(isLoading),
    error: appError,
    refresh: invalidate,
    getMore: loadNextPage,
  };
}
