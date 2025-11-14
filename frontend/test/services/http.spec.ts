// SPDX-License-Identifier: AGPL-3.0-or-later
import { beforeEach, describe, expect, it, vi } from "vitest";

import { del, fetchWithoutToken, get, post, put } from "~/app/services/http";

import { expectRequest, getFetchCall } from "./helpers";

type FetchOptionsShape = Record<string, unknown>;
type FetchFn = (url: string, opts: FetchOptionsShape) => Promise<unknown>;
type FetchRawFn = (
  url: string,
  opts: FetchOptionsShape
) => Promise<{ _data: unknown }>;
interface FetchGlobal extends FetchFn {
  raw: FetchRawFn;
}

declare global {
  var $fetch: FetchGlobal;
  var BASE_BACKEND_URL: string;
  var useAuth: () => { token?: { value?: string } };
}

describe("services/http", () => {
  let fetchMock: ReturnType<typeof vi.fn<FetchFn>>;
  let fetchRawMock: ReturnType<typeof vi.fn<FetchRawFn>>;

  beforeEach(() => {
    // Reset globals and mocks before each test.
    globalThis.BASE_BACKEND_URL = "https://api.example.test";

    // Default auth: present token.
    globalThis.useAuth = () => ({ token: { value: "Bearer test-token" } });

    fetchMock = vi.fn<FetchFn>();
    fetchRawMock = vi.fn<FetchRawFn>();
    const combined = Object.assign(fetchMock, {
      raw: fetchRawMock,
    }) as FetchGlobal;
    globalThis.$fetch = combined;

    vi.restoreAllMocks();
  });

  // MARK: GET Method

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
    // Simulate missing token so service does not add Authorization.
    globalThis.useAuth = () => ({ token: { value: undefined } });
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

  // MARK: POST Method

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

  // MARK: PUT Method

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

  // MARK: DELETE Method

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
    // Simulate useAuth throwing (caught in authHeader()).
    globalThis.useAuth = (() => {
      throw new Error("no auth context");
    }) as typeof globalThis.useAuth;
    fetchMock.mockResolvedValueOnce({ ok: true });

    await get("/no-auth-provider");

    const call = fetchMock.mock.calls[0][1] as {
      headers?: Record<string, string>;
    };
    // Should not include Authorization if useAuth is not available.
    expect(call.headers?.Authorization).toBeUndefined();
  });
});
