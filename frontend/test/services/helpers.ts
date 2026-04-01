// SPDX-License-Identifier: AGPL-3.0-or-later
import { beforeEach, expect, vi } from "vitest";

import type { FetchFn, FetchRawFn, FetchGlobal } from "../vitest-globals.d.ts";

/**
 * Sets up global mocks for service tests, including $fetch and useAuth.
 * Call this in a test file to initialize the mocks before each test.
 * @returns an object with the fetch mocks for use in assertions.
 */
export function setupServiceTestMocks() {
  const mocks = {
    fetchMock: vi.fn<FetchFn>(),
    fetchRawMock: vi.fn<FetchRawFn>(),
  };

  beforeEach(() => {
    globalThis.BASE_BACKEND_URL = "https://api.example.test";
    globalThis.useAuth = () => ({ token: { value: "Bearer test-token" } });

    mocks.fetchMock = vi.fn<FetchFn>();
    mocks.fetchRawMock = vi.fn<FetchRawFn>();
    const combined = Object.assign(mocks.fetchMock, {
      raw: mocks.fetchRawMock,
    }) as FetchGlobal;
    globalThis.$fetch = combined;

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
/**
 * Helper to extract the URL and options from a specific call to the mocked fetch function.
 * @param fetchMock - The mocked fetch function to extract call arguments from
 * @param index - Index of the fetch call to retrieve (default: 0)
 * @returns An array containing the URL and options of the specified fetch call, typed as [string, FetchOptions]
 */
export function getFetchCall(
  fetchMock: ReturnType<typeof vi.fn<FetchFn>>,
  index = 0
): FetchCall {
  return fetchMock.mock.calls[index] as FetchCall;
}

// Assert common HTTP request properties.
/**
 * Helper to assert common properties of a JSON HTTP request made with the mocked fetch function.
 * @param fetchMock - The mocked fetch function to assert
 * @param expectedUrl - The expected URL of the request
 * @param expectedMethod - The expected HTTP method of the request
 * @param expectedBody - The expected body of the request (optional)
 */
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
/**
 * Helper to assert common properties of a simple HTTP request made with the mocked fetch function.
 * @param fetchMock - The mocked fetch function to assert
 * @param expectedUrl - The expected URL of the request
 * @param expectedMethod - The expected HTTP method of the request
 */
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
