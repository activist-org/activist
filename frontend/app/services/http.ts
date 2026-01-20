// SPDX-License-Identifier: AGPL-3.0-or-later
function baseURL(isAuthenticated = true): string {
  const apiBase = '/api/'
  if (isAuthenticated) {
    return apiBase + 'auth';
  }
  return apiBase + 'public';
}

export function get<T>(url: string, options?: ServiceOptions) {
  const headers = {
    ...(options?.headers || {}),
  };
  console.log(`GET Request to ${url} with options:`, options, baseURL(!options?.withoutAuth));
  return $fetch<T>(url, {
    baseURL: baseURL(!options?.withoutAuth),
    method: "GET" as const,
    ...options,
    headers,
  });
}

export function post<T, X extends AcceptedBody>(
  url: string,
  body?: X,
  options?: ServiceOptionsWithBody
) {
  const headers = {
    ...(options?.headers || {}),
  };
  return $fetch<T>(url, {
    baseURL: baseURL(!options?.withoutAuth),
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
    ...(options?.headers || {})
  };
  return $fetch<T>(url, {
    baseURL: baseURL(!options?.withoutAuth),
    method: "PUT" as const,
    body,
    ...options,
    headers,
  });
}

export function del<T>(url: string, options?: ServiceOptions) {
  const headers = {
    ...(options?.headers || {}),
  };
  return $fetch<T>(url, {
    baseURL: baseURL(!options?.withoutAuth),
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
  const res = await $fetch.raw(baseURL(false) + url, {
    data,
    headers: {},
    method,
    body,
  });

  return res._data;
};
