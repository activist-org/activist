// SPDX-License-Identifier: AGPL-3.0-or-later
import { beforeEach, describe, expect, it } from "vitest";

import { del, fetchSession, get, post, put } from "~/services/http";

const mocks = () =>
  globalThis.httpMocks as {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    del: ReturnType<typeof vi.fn>;
    fetchSession: ReturnType<typeof vi.fn>;
  };

describe("services/http (mocked contract)", () => {
  beforeEach(() => {
    mocks().get.mockClear();
    mocks().post.mockClear();
    mocks().put.mockClear();
    mocks().del.mockClear();
    mocks().fetchSession.mockClear();
  });

  it("get() calls the http get wrapper", async () => {
    mocks().get.mockResolvedValueOnce({ ok: true });

    const result = await get("/foo");

    expect(mocks().get).toHaveBeenCalledTimes(1);
    expect(mocks().get).toHaveBeenCalledWith("/foo", {
      baseURL: "/api/auth",
      method: "GET",
      headers: {},
    });
    expect(result).toEqual({ ok: true });
  });

  it("get() forwards options (withoutAuth, headers)", async () => {
    mocks().get.mockResolvedValueOnce({ ok: true });

    await get("/bar", {
      withoutAuth: true,
      headers: { Authorization: "Bearer caller", "X-Trace": "t" },
    });

    expect(mocks().get).toHaveBeenCalledWith("/bar", {
      baseURL: "/api/public",
      method: "GET",
      withoutAuth: true,
      headers: { Authorization: "Bearer caller", "X-Trace": "t" },
    });
  });

  // MARK: Get Raw

  it("getRaw() returns the full public response and respects withoutAuth", async () => {
    const rawResponse = {
      _data: new Blob(["calendar"]),
      headers: new Headers({ "Content-Disposition": "attachment" }),
      status: 200,
    };

    mocks().get.mockResolvedValueOnce(rawResponse);

    const result = await getRaw<Blob>("/calendar", {
      headers: { "X-Trace": "calendar-download" },
      responseType: "blob",
      withoutAuth: true,
    });

    expect(result).toBe(rawResponse);
    expect(mocks().get).toHaveBeenCalledTimes(1);
    const [url, opts] = mocks().get.mock.calls[0] as [
      string,
      Record<string, unknown>,
    ];
    expect(url).toBe("/calendar");
    expect(opts.baseURL).toBe("/api/public");
    expect(opts.method).toBe("GET");
    expect(opts.responseType).toBe("blob");
    expect(opts.withoutAuth).toBe(true);
    expect(opts.headers).toEqual({ "X-Trace": "calendar-download" });
  });

  // MARK: Post

  it("post() sends body and sets baseURL to /api/auth by default", async () => {
    mocks().post.mockResolvedValueOnce({ ok: true });
    const body = { a: 1 };

    await post("/items", body);

    // The wrapper merges body into the options object.
    expect(mocks().post).toHaveBeenCalledWith("/items", {
      baseURL: "/api/auth",
      method: "POST",
      body,
      headers: {},
    });
  });

  it("put() sends body and merges headers through the put wrapper", async () => {
    mocks().put.mockResolvedValueOnce({ ok: true });
    const body = { name: "x" };

    await put("/items/1", body, {
      headers: { "Content-Type": "application/json" },
    });

    expect(mocks().put).toHaveBeenCalledWith("/items/1", {
      baseURL: "/api/auth",
      method: "PUT",
      body,
      headers: { "Content-Type": "application/json" },
    });
  });

  it("del() forwards options through the del wrapper", async () => {
    mocks().del.mockResolvedValueOnce({ ok: true });

    await del("/items/2", { withoutAuth: true });

    expect(mocks().del).toHaveBeenCalledWith("/items/2", {
      baseURL: "/api/public",
      method: "DELETE",
      withoutAuth: true,
      headers: {},
    });
  });

  it("fetchSession() calls the fetchSession wrapper", async () => {
    mocks().fetchSession.mockResolvedValueOnce({ ok: true, value: 42 });

    const result = await fetchSession("/open", { q: 1 }, "POST", {
      body: 1,
    });

    // fetchSession maps its params to an options object.
    expect(mocks().fetchSession).toHaveBeenCalledWith("/open", {
      baseURL: "/api/session",
      data: { q: 1 },
      method: "POST",
      body: { body: 1 },
      headers: {},
    });
    expect(result).toEqual({ ok: true, value: 42 });
  });
});
