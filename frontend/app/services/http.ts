// SPDX-License-Identifier: AGPL-3.0-or-later

import { useGetBaseURLs } from "~/composables/generic";

function baseURL() {
  const { BASE_BACKEND_URL } = useGetBaseURLs();
  return BASE_BACKEND_URL as string;
}

function authHeader(): Record<string, string> {
  try {
    const { token } = useAuth();
    return token?.value ? { Authorization: `${token.value}` } : {};
  } catch {
    return {};
  }
}

export function get<T>(url: string, options?: ServiceOptions) {
  const headers = {
    ...(options?.headers || {}),
    ...(options?.withoutAuth ? {} : authHeader()),
  };
  return $fetch<T>(url, {
    baseURL: baseURL(),
    method: "GET" as const,
    headers,
    ...options,
  });
}

export function post<T, X extends AcceptedBody>(
  url: string,
  body?: X,
  options?: ServiceOptionsWithBody
) {
  const headers = {
    ...(options?.headers || {}),
    ...(options?.withoutAuth ? {} : authHeader()),
  };
  return $fetch<T>(url, {
    baseURL: baseURL(),
    method: "POST" as const,
    body,
    ...options,
    headers,
  });
}

export function put<T, X extends AcceptedBody>(
  url: string,
  body?: X,
  options?: ServiceOptionsWithBody
) {
  const headers: HeadersInit = {
    ...(options?.headers || {}),
    ...(options?.withoutAuth ? {} : authHeader()),
  };
  return $fetch<T>(url, {
    baseURL: baseURL(),
    method: "PUT" as const,
    body,
    ...options,
    headers,
  });
}

export function del<T>(url: string, options?: ServiceOptions) {
  const headers = {
    ...(options?.headers || {}),
    ...(options?.withoutAuth ? {} : authHeader()),
  };
  return $fetch<T>(url, {
    baseURL: baseURL(),
    method: "DELETE" as const,
    ...options,
    headers,
  });
}

/**
 * Returns data given the authentication status of the user.
 * @param url Backend URL to make the request to.
 * @param data Data to be returned.
 * @returns The resulting data from the table.
 */

export const fetchWithoutToken = async (
  url: string,
  data: object | undefined,
  method: "GET" | "POST" = "GET",
  body?: object | undefined
) => {
  const res = await $fetch.raw(BASE_BACKEND_URL + url, {
    data,
    headers: {},
    method,
    body,
  });

  return res._data;
};
