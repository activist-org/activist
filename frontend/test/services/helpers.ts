// SPDX-License-Identifier: AGPL-3.0-or-later
import { beforeEach, expect, vi } from "vitest";

import type { FetchFn, FetchRawFn, FetchGlobal } from "../vitest-globals.d.ts";

type TestGlobals = {
  $fetch: FetchGlobal;
  BASE_BACKEND_URL: string;
  useAuth: () => { token?: { value?: string } };
};

export function setupServiceTestMocks() {
  const mocks = {
    fetchMock: vi.fn<FetchFn>(),
    fetchRawMock: vi.fn<FetchRawFn>(),
  };

  beforeEach(() => {
    const g = globalThis as unknown as TestGlobals;
    g.BASE_BACKEND_URL = "https://api.example.test";
    g.useAuth = () => ({ token: { value: "Bearer test-token" } });

    mocks.fetchMock = vi.fn<FetchFn>();
    mocks.fetchRawMock = vi.fn<FetchRawFn>();
    const combined = Object.assign(mocks.fetchMock, {
      raw: mocks.fetchRawMock,
    }) as unknown as FetchGlobal;
    g.$fetch = combined;

    vi.restoreAllMocks();
  });

  return () => mocks;
}

// Common fetch options types.
export type FetchOptions = {
  method: string;
  baseURL: string;
  headers?: Record<string, string>;
  body?: unknown;
};

export type FetchCall = [string, FetchOptions];

// Extract fetch call arguments with proper typing.
export function getFetchCall(
  fetchMock: ReturnType<typeof vi.fn<FetchFn>>,
  index = 0
): FetchCall {
  return fetchMock.mock.calls[index] as FetchCall;
}

// Assert common HTTP request properties.
export function expectJsonRequest(
  fetchMock: ReturnType<typeof vi.fn<FetchFn>>,
  expectedUrl: string | RegExp,
  expectedMethod: string,
  expectedBody?: unknown
): void {
  const [url, opts] = getFetchCall(fetchMock);
  if (typeof expectedUrl === "string") {
    expect(url).toBe(expectedUrl);
  } else {
    expect(url).toMatch(expectedUrl);
  }
  expect(opts.method).toBe(expectedMethod);
  expect(typeof opts.baseURL).toBe("string");
  expect(opts.headers?.["Content-Type"]).toBe("application/json");
  if (expectedBody !== undefined) {
    expect(opts.body).toMatchObject(expectedBody as Record<string, unknown>);
  }
}

// Assert simple HTTP request (no body checks).
export function expectRequest(
  fetchMock: ReturnType<typeof vi.fn<FetchFn>>,
  expectedUrl: string | RegExp,
  expectedMethod: string
): void {
  const [url, opts] = getFetchCall(fetchMock);
  if (typeof expectedUrl === "string") {
    expect(url).toBe(expectedUrl);
  } else {
    expect(url).toMatch(expectedUrl);
  }
  expect(opts.method).toBe(expectedMethod);
  expect(typeof opts.baseURL).toBe("string");
}
