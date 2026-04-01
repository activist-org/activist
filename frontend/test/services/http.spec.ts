// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Tests for http service helpers after nuxt-auth-utils migration.
 *
 * Key changes from the old auth approach:
 * - Authorization headers are now added server-side by middleware, not client-side
 * - get/post/put/del use baseURL "/api/auth" (authenticated) or "/api/public" (withoutAuth)
 * - fetchSession uses baseURL "/api/session" and $fetch directly (not $fetch.raw)
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { FetchFn, FetchGlobal } from "../vitest-globals";

import { del, fetchSession, get, post, put } from "../../app/services/http";
import { expectRequest, getFetchCall } from "./helpers";

describe("services/http", () => {
  let fetchMock: ReturnType<typeof vi.fn<FetchFn>>;

  beforeEach(() => {
    fetchMock = vi.fn<FetchFn>();
    const combined = fetchMock as FetchGlobal;
    globalThis.$fetch = combined;

    vi.restoreAllMocks();
  });

  // MARK: Get

  it("get() sets baseURL to /api/auth and GET method by default", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });

    await get("/foo");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(fetchMock, "/foo", "GET");
    const [, opts] = getFetchCall(fetchMock);
    expect(opts.baseURL).toBe("/api/auth");
  });

  it("get() sets baseURL to /api/public when withoutAuth is true", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });

    await get("/bar", { withoutAuth: true });

    const [, opts] = getFetchCall(fetchMock);
    expect(opts.baseURL).toBe("/api/public");
  });

  it("get() preserves caller-provided headers", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });

    await get("/caller-auth", {
      headers: { Authorization: "Bearer caller", "X-Trace": "t" },
    });

    const [, opts] = getFetchCall(fetchMock);
    expect(opts.headers?.Authorization).toBe("Bearer caller");
    expect(opts.headers?.["X-Trace"]).toBe("t");
  });

  // MARK: Post

  it("post() sends body and sets baseURL to /api/auth by default", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });
    const body = { a: 1 };

    await post("/items", body);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = getFetchCall(fetchMock);
    expect(url).toBe("/items");
    expect(opts.method).toBe("POST");
    expect(opts.baseURL).toBe("/api/auth");
    expect(opts.body).toEqual(body);
  });

  // MARK: Put

  it("put() sends body and merges headers", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });
    const body = { name: "x" };

    await put("/items/1", body, {
      headers: { "Content-Type": "application/json" },
    });

    const [, opts] = getFetchCall(fetchMock);
    expect(opts.method).toBe("PUT");
    expect(opts.body).toEqual(body);
    expect(opts.baseURL).toBe("/api/auth");
    expect(opts.headers?.["Content-Type"]).toBe("application/json");
  });

  // MARK: Delete

  it("del() sets DELETE method and respects withoutAuth", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });

    await del("/items/2", { withoutAuth: true });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectRequest(fetchMock, "/items/2", "DELETE");
    const [, opts] = getFetchCall(fetchMock);
    expect(opts.baseURL).toBe("/api/public");
  });

  // MARK: Fetch Session

  it("fetchSession() calls $fetch with baseURL /api/session", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, value: 42 });

    const result = await fetchSession("/open", { q: 1 }, "POST", {
      body: 1,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = getFetchCall(fetchMock);
    expect(url).toBe("/open");
    expect(opts.baseURL).toBe("/api/session");
    expect(opts.method).toBe("POST");
    expect(opts.data).toEqual({ q: 1 });
    expect(opts.body).toEqual({ body: 1 });
    expect(result).toEqual({ ok: true, value: 42 });
  });
});
