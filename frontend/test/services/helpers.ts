// SPDX-License-Identifier: AGPL-3.0-or-later
import type { vi } from "vitest";

import { beforeEach, expect } from "vitest";

export interface HttpMocks {
  fetchMock: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  del: ReturnType<typeof vi.fn>;
  fetchSession: ReturnType<typeof vi.fn>;
  fetchImage: ReturnType<typeof vi.fn>;
}

export function setupServiceTestMocks() {
  beforeEach(() => {
    const mocks = globalThis.httpMocks as HttpMocks;
    mocks.fetchMock.mockReset();
    mocks.get.mockReset();
    mocks.post.mockReset();
    mocks.put.mockReset();
    mocks.del.mockReset();
    mocks.fetchSession.mockReset();
    mocks.fetchImage.mockReset();
  });

  return () => globalThis.httpMocks as HttpMocks;
}

// Assert common HTTP request properties against the mocked ~/services/http.
export function getFetchCall(
  httpMock: ReturnType<typeof vi.fn>,
  callIndex = 0
): [string, Record<string, unknown>] {
  const call = httpMock.mock.calls[callIndex] as [
    string,
    Record<string, unknown>?,
  ];
  const [url, opts] = call;
  return [url, (opts ?? {}) as Record<string, unknown>];
}

export function expectJsonRequest(
  httpMock: ReturnType<typeof vi.fn>,
  expectedUrl: string | RegExp,
  expectedMethod: "GET" | "POST" | "PUT" | "DELETE",
  expectedBody?: unknown
): void {
  const call = httpMock.mock.calls[0] as [string, Record<string, unknown>?];
  const [url, opts] = call;
  const body = (opts as { body?: unknown } | undefined)?.body;

  if (typeof expectedUrl === "string") {
    expect(url).toBe(expectedUrl);
  } else {
    expect(url).toMatch(expectedUrl);
  }
  expect(
    (opts as { headers?: Record<string, string> } | undefined)?.headers?.[
      "Content-Type"
    ]
  ).toBe("application/json");
  if (expectedBody !== undefined && body !== undefined) {
    expect(body).toMatchObject(expectedBody as Record<string, unknown>);
  }
}

export function expectRequest(
  httpMock: ReturnType<typeof vi.fn>,
  expectedUrl: string | RegExp
): void {
  const [url] = httpMock.mock.calls[0] as [string];
  if (typeof expectedUrl === "string") {
    expect(url).toBe(expectedUrl);
  } else {
    expect(url).toMatch(expectedUrl);
  }
}
