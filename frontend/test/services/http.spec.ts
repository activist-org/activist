// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * REFACTORED: This test demonstrates overriding composables in beforeEach and per-test.
 * - useAuth() is mocked in test/setup.ts with default behavior
 * - We override it in beforeEach() to reset to a default state for each test
 * - Individual tests override it again within the test for specific scenarios
 *   (e.g., no token, throwing errors)
 * - This pattern is useful when you need:
 *   - A default mock setup for most tests (in beforeEach)
 *   - Specific behavior for individual tests (override within test)
 *   - Error handling and edge case testing
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  FetchFn,
  FetchRawFn,
  FetchGlobal,
  GlobalThisTest,
} from "../vitest-globals";

import {
  del,
  fetchWithoutToken,
  get,
  post,
  put,
} from "../../app/services/http";
import { expectRequest, getFetchCall } from "./helpers";

describe("services/http", () => {
  let fetchMock: ReturnType<typeof vi.fn<FetchFn>>;
  let fetchRawMock: ReturnType<typeof vi.fn<FetchRawFn>>;

  beforeEach(() => {
    // Reset globals and mocks before each test.
    const global = globalThis as GlobalThisTest;
    global.BASE_BACKEND_URL = "https://api.example.test";

    // Default auth: present token.
    // Override useAuth in beforeEach to reset to default state for each test.
    // Individual tests can override again for specific scenarios.
    global.useAuth = () => ({
      signIn: async () => {
        return Promise.resolve();
      },
      signOut: async () => {
        return Promise.resolve();
      },
      data: { value: null },
      signUp: async () => {
        return Promise.resolve();
      },
      token: { value: "Bearer test-token" },
    });

    fetchMock = vi.fn<FetchFn>();
    fetchRawMock = vi.fn<FetchRawFn>();
    const combined = Object.assign(fetchMock, {
      raw: fetchRawMock,
    }) as FetchGlobal;
    global.$fetch = combined;

    vi.restoreAllMocks();
  });

  // MARK: Get

  it("get() sets baseURL, GET method, and includes Authorization by default", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });

    await get("/foo");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(fetchMock, "/foo", "GET");
    const [, opts] = getFetchCall(fetchMock);
    expect(opts.headers).toMatchObject({ Authorization: "Bearer test-token" });
  });

  it("get() omits Authorization when withoutAuth is true", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });

    await get("/bar", { withoutAuth: true });

    const call = fetchMock.mock.calls[0][1] as {
      headers?: Record<string, string>;
    };
    expect(call.headers).not.toHaveProperty("Authorization");
  });

  it("get() with withoutAuth preserves caller Authorization header", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });

    await get("/caller-auth", {
      withoutAuth: true,
      headers: { Authorization: "Bearer caller", "X-Trace": "t" },
    });

    const call = fetchMock.mock.calls[0][1] as {
      headers?: Record<string, string>;
    };
    expect(call.headers?.Authorization).toBe("Bearer caller");
    expect(call.headers?.["X-Trace"]).toBe("t");
  });

  it("get() keeps caller Authorization when no token available", async () => {
    // Override useAuth for this specific test scenario (no token).
    // This shows overriding the beforeEach default for a specific test.
    const global = globalThis as GlobalThisTest;
    global.useAuth = () => ({
      token: { value: null },
      signIn: async () => {
        return Promise.resolve();
      },
      signOut: async () => {
        return Promise.resolve();
      },
      data: { value: null },
      signUp: async () => {
        return Promise.resolve();
      },
    });
    fetchMock.mockResolvedValueOnce({ ok: true });

    await get("/no-token", {
      headers: { Authorization: "Bearer external" },
    });

    const call = fetchMock.mock.calls[0][1] as {
      headers?: Record<string, string>;
    };
    expect(call.headers?.Authorization).toBe("Bearer external");
  });

  it("get() merges headers and prefers auth header over provided Authorization", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });

    await get("/baz", {
      headers: { Authorization: "Bearer wrong", "X-Custom": "1" },
    });

    const call = fetchMock.mock.calls[0][1] as {
      headers?: Record<string, string>;
    };
    expect(call.headers?.Authorization).toBe("Bearer test-token");
    expect(call.headers?.["X-Custom"]).toBe("1");
  });

  // MARK: Post

  it("post() sends body and includes Authorization", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });
    const body = { a: 1 };

    await post("/items", body);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = getFetchCall(fetchMock);
    expect(url).toBe("/items");
    expect(opts.method).toBe("POST");
    expect(typeof opts.baseURL).toBe("string");
    expect(opts.body).toEqual(body);
    expect(opts.headers?.Authorization).toBe("Bearer test-token");
  });

  // MARK: Put

  it("put() sends body, merges headers, and includes Authorization unless withoutAuth", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });
    const body = { name: "x" };

    await put("/items/1", body, {
      headers: { "Content-Type": "application/json" },
    });

    const call = fetchMock.mock.calls[0][1] as {
      method: string;
      body: unknown;
      headers: Record<string, string>;
    };
    expect(call).toMatchObject({ method: "PUT", body });
    expect(call.headers).toMatchObject({
      Authorization: "Bearer test-token",
      "Content-Type": "application/json",
    });
  });

  // MARK: Delete

  it("del() sets DELETE method and respects withoutAuth", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });

    await del("/items/2", { withoutAuth: true });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(fetchMock, "/items/2", "DELETE");
    const [, opts] = getFetchCall(fetchMock);
    expect(opts.headers).toBeDefined();
    expect(opts.headers?.Authorization).toBeUndefined();
  });

  // MARK: Fetch Without Token

  it("fetchWithoutToken() calls $fetch.raw with absolute URL and returns _data", async () => {
    const rawResponse = { _data: { ok: true, value: 42 } } as const;
    fetchRawMock.mockResolvedValueOnce(rawResponse);

    const result = await fetchWithoutToken("/open", { q: 1 }, "POST", {
      body: 1,
    });

    expect(fetchRawMock).toHaveBeenCalledTimes(1);
    const [rawUrl, rawOpts] = fetchRawMock.mock.calls[0] as [
      string,
      {
        data: unknown;
        headers: Record<string, string>;
        method: string;
        body: unknown;
      },
    ];
    expect(rawUrl.endsWith("/open")).toBe(true);
    expect(rawOpts).toMatchObject({
      data: { q: 1 },
      headers: {},
      method: "POST",
      body: { body: 1 },
    });
    expect(result).toEqual(rawResponse._data);
  });

  // MARK: Error Handling

  it("authHeader() gracefully handles absence of useAuth() (no throw)", async () => {
    // Override useAuth to throw an error for this error-handling test.
    // This demonstrates overriding for edge cases/error scenarios.
    const global = globalThis as GlobalThisTest;
    global.useAuth = (() => {
      throw new Error("no auth context");
    }) as typeof global.useAuth;
    fetchMock.mockResolvedValueOnce({ ok: true });

    await get("/no-auth-provider");

    const call = fetchMock.mock.calls[0][1] as {
      headers?: Record<string, string>;
    };
    // Should not include Authorization if useAuth is not available.
    expect(call.headers?.Authorization).toBeUndefined();
  });
});
