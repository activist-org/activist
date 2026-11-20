// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { computed, effectScope, isReadonly, nextTick, ref } from "vue";

import { useCustomInfiniteQuery } from "../../app/composables/generic";

type Item = { id: number };
type Page = { data: Item[]; isLastPage: boolean };

type QueryOptions = {
  initialPageParam: number;
  key: () => readonly unknown[];
  query: (params: { pageParam: number }) => Promise<Page>;
  getNextPageParam: (lastPage: Page, allPages: Page[]) => number | null;
};

const mocks = vi.hoisted(() => ({
  useInfiniteQuery: globalThis.useInfiniteQueryMock,
  useAppError: vi.fn(),
}));

mockNuxtImport("useAppError", () => mocks.useAppError);

describe("useCustomInfiniteQuery", () => {
  let scope: ReturnType<typeof effectScope>;
  let pages: ReturnType<typeof ref<{ pages: Page[] } | undefined>>;
  let loading: ReturnType<typeof ref<boolean>>;
  let queryError: ReturnType<typeof ref<Error | null>>;
  let appError: ReturnType<typeof ref<Error | null>>;
  let handleError: ReturnType<typeof vi.fn>;
  let loadNextPage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    scope = effectScope();
    pages = ref<{ pages: Page[] }>();
    loading = ref(false);
    queryError = ref<Error | null>(null);
    appError = ref<Error | null>(null);
    handleError = vi.fn();
    loadNextPage = vi.fn();

    mocks.useInfiniteQuery.mockReturnValue({
      data: pages,
      isLoading: loading,
      error: queryError,
      loadNextPage,
    });
    mocks.useAppError.mockReturnValue({ handleError, error: appError });
  });

  afterEach(() => scope.stop());

  function setup() {
    const filters = ref("upcoming");
    const key = computed(() => ["event", "list", filters.value] as const);
    const invalidate = vi.fn(async () => {});
    const callback = vi.fn(
      async ({ page }: { page: number; page_size: number }) => ({
        data: [{ id: page }],
        isLastPage: false,
      })
    );

    const result = scope.run(() =>
      useCustomInfiniteQuery(key, invalidate, callback)
    )!;
    const options = mocks.useInfiniteQuery.mock.calls[0]![0] as QueryOptions;

    return { result, options, filters, invalidate, callback };
  }

  it("uses a reactive query key and requests the specified page", async () => {
    const { options, filters, callback } = setup();

    expect(options.initialPageParam).toBe(1);
    expect(options.key()).toEqual(["event", "list", "upcoming"]);

    filters.value = "past";
    expect(options.key()).toEqual(["event", "list", "past"]);

    await expect(options.query({ pageParam: 2 })).resolves.toEqual({
      data: [{ id: 2 }],
      isLastPage: false,
    });
    expect(callback).toHaveBeenCalledWith({ page: 2, page_size: 10 });
  });

  it("returns the next page number or stops at the last page", () => {
    const { options } = setup();
    const first = { data: [{ id: 1 }], isLastPage: false };
    const last = { data: [{ id: 2 }], isLastPage: true };

    expect(options.getNextPageParam(first, [first])).toBe(2);
    expect(options.getNextPageParam(last, [first, last])).toBeNull();
  });

  it("flattens pages and exposes readonly loading state", () => {
    const { result } = setup();

    expect(result.data.value).toEqual([]);
    pages.value = {
      pages: [
        { data: [{ id: 1 }], isLastPage: false },
        { data: [{ id: 2 }], isLastPage: true },
      ],
    };
    loading.value = true;

    expect(result.data.value).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.pending.value).toBe(true);
    expect(isReadonly(result.pending)).toBe(true);
  });

  it("forwards query errors to the app error handler", async () => {
    const { result } = setup();
    const error = new Error("Request failed");

    queryError.value = error;
    await nextTick();

    expect(handleError).toHaveBeenCalledWith(error);
    expect(result.error).toBe(appError);
  });

  it("exposes invalidation and loading the next page", async () => {
    const { result, invalidate } = setup();

    await result.refresh();
    result.getMore();

    expect(invalidate).toHaveBeenCalledOnce();
    expect(loadNextPage).toHaveBeenCalledOnce();
  });
});
