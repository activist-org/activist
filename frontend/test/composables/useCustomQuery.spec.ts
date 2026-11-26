// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { computed, effectScope, isReadonly, nextTick, ref } from "vue";

import { useCustomQuery } from "../../app/composables/generic";

type QueryOptions = {
  key: unknown;
  query: () => Promise<number>;
  enabled: boolean;
};

const mocks = vi.hoisted(() => ({
  useQuery: globalThis.useQueryMock,
  useAppError: vi.fn(),
}));

mockNuxtImport("useAppError", () => mocks.useAppError);

describe("useCustomQuery", () => {
  let scope: ReturnType<typeof effectScope>;
  let loading: ReturnType<typeof ref<boolean>>;
  let queryError: ReturnType<typeof ref<Error | null>>;
  let appError: ReturnType<typeof ref<Error | null>>;
  let handleError: ReturnType<typeof vi.fn>;
  let data: ReturnType<typeof ref<number>>;
  beforeEach(() => {
    vi.clearAllMocks();
    scope = effectScope();

    loading = ref(false);
    queryError = ref<Error | null>(null);
    data = ref(1);

    appError = ref<Error | null>(null);
    handleError = vi.fn();

    mocks.useQuery.mockReturnValue({
      data: data,
      pending: loading,
      error: queryError,
      refresh: () => {},
    });
    mocks.useAppError.mockReturnValue({ handleError, error: appError });
  });

  afterEach(() => scope.stop());

  function setup() {
    const id = ref("00000000-0000-4000-8000-000000000000");
    const key = computed(() => ["group", id.value]);
    const query = async () => {
      return 1;
    };
    const enabled = false;

    const result = scope.run(() => useCustomQuery(key, query, enabled))!;
    const options = mocks.useQuery.mock.calls[0]![0] as QueryOptions;

    return { result, options, id, key, query, enabled };
  }

  it("forwards query errors to the app error handler", async () => {
    const { result } = setup();
    const error = new Error("Request failed");

    queryError.value = error;
    await nextTick();

    expect(handleError).toHaveBeenCalledWith(error);
    expect(result.error).toBe(appError);
  });
});
