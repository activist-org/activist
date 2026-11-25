// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { computed, effectScope, isReadonly, nextTick, ref } from "vue";

import { useCustomQuery } from "../../app/composables/generic";

type Item = { id: string; name: string };

type QueryOptions = {
  key: () => readonly unknown[];
  query: () => Promise<Item>;
  enabled?: unknown;
};

const mocks = vi.hoisted(() => ({
  useQuery: globalThis.useQueryMock,
  useAppError: vi.fn(),
}));

mockNuxtImport("useAppError", () => mocks.useAppError);

describe("useCustomQuery", () => {
  let scope: ReturnType<typeof effectScope>;
  let queryData: ReturnType<typeof ref<Item | undefined>>;
  let loading: ReturnType<typeof ref<boolean>>;
  let queryError: ReturnType<typeof ref<Error | null>>;
  let appError: ReturnType<typeof ref<Error | null>>;
  let handleError: ReturnType<typeof vi.fn>;
  let refresh: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    scope = effectScope();
    queryData = ref<Item | undefined>();
    loading = ref(false);
    queryError = ref<Error | null>(null);
    appError = ref<Error | null>(null);
    handleError = vi.fn();
    refresh = vi.fn(async () => {});

    mocks.useQuery.mockReturnValue({
      data: queryData,
      isLoading: loading,
      error: queryError,
      refresh,
    });
    mocks.useAppError.mockReturnValue({ handleError, error: appError });
  });

  afterEach(() => scope.stop());

  function setup(enabled?: ReturnType<typeof computed<boolean>>) {
    const entityId = ref("123");
    const key = () => ["entity", entityId.value] as const;
    const queryFn = vi.fn(async () => ({
      id: entityId.value,
      name: "Test Entity",
    }));

    const result = scope.run(() =>
      useCustomQuery(key, queryFn, enabled !== undefined ? { enabled } : {})
    )!;
    const options = mocks.useQuery.mock.calls[0]![0] as QueryOptions;

    return { result, options, entityId, queryFn };
  }

  it("resolves a reactive key getter and executes the query function", async () => {
    const { options, entityId, queryFn } = setup();

    expect(options.key()).toEqual(["entity", "123"]);

    entityId.value = "456";
    expect(options.key()).toEqual(["entity", "456"]);

    await expect(options.query()).resolves.toEqual({
      id: "456",
      name: "Test Entity",
    });
    expect(queryFn).toHaveBeenCalledOnce();
  });

  it("supports static keys and optional enabled state", () => {
    const enabled = computed(() => true);
    const staticKey = ["topics"] as const;
    const queryFn = vi.fn(async () => ({ id: "1", name: "Topic" }));

    scope.run(() => useCustomQuery(staticKey, queryFn, { enabled }));
    const options = mocks.useQuery.mock.calls[0]![0] as QueryOptions;

    expect(options.key()).toEqual(["topics"]);
    expect(options.enabled).toBe(enabled);
  });

  it("exposes data, readonly pending state, and refresh", async () => {
    const { result } = setup();

    expect(result.data.value).toBeUndefined();
    queryData.value = { id: "123", name: "Test Entity" };
    loading.value = true;

    expect(result.data.value).toEqual({ id: "123", name: "Test Entity" });
    expect(result.pending.value).toBe(true);
    expect(isReadonly(result.pending)).toBe(true);

    await result.refresh();
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("forwards query errors to the app error handler", async () => {
    const { result } = setup();
    const error = new Error("Request failed");

    queryError.value = error;
    await nextTick();

    expect(handleError).toHaveBeenCalledWith(error);
    expect(result.error).toBe(appError);
  });
});
