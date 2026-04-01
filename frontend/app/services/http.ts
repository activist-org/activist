// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Function to determine the appropriate base URL for API requests based on whether the request needs to be authenticated or public.
 * @param isAuthenticated - A boolean indicating whether the service should use the authenticated API base URL.
 * @returns The base URL string for API requests, which varies based on the authentication status of the user.
 */
function baseURL(isAuthenticated = true): string {
  const apiBase = "/api/";
  if (isAuthenticated) {
    return apiBase + "auth";
  }
  return apiBase + "public";
}

/**
 * Generic function to make a GET request to the backend API, with optional configuration for headers and authentication.
 * @param url URL to make the request to.
 * @param options Options for configuring the request, including headers and authentication settings.
 * @returns The response data from the API, typed as a generic type T, which allows for flexible handling of different response shapes based on the specific API endpoint being called.
 */
export function get<T>(url: string, options?: ServiceOptions) {
  const headers = {
    ...(options?.headers || {}),
  };
  return $fetch<T>(url, {
    baseURL: baseURL(!options?.withoutAuth),
    method: "GET" as const,
    ...options,
    headers,
  });
}

/**
 * Generic function to make a POST request to the backend API, with optional configuration for headers and authentication.
 * @param url URL to make the request to.
 * @param body Request payload, typed as a generic type X, allowing for flexible handling of different request shapes.
 * @param options Options for configuring the request, including headers and authentication settings.
 * @returns The response data from the API, typed as a generic type T, which allows for flexible handling of different response shapes based on the specific API endpoint being called.
 */
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

/**
 * Generic function to make a PUT request to the backend API, with optional configuration for headers and authentication.
 * @param url URL to make the request to.
 * @param body Request payload, typed as a generic type X, allowing for flexible handling of different request shapes.
 * @param options Options for configuring the request, including headers and authentication settings.
 * @returns The response data from the API, typed as a generic type T, which allows for flexible handling of different response shapes based on the specific API endpoint being called.
 */
export function put<T, X extends AcceptedBody>(
  url: string,
  body?: X,
  options?: ServiceOptionsWithBody
) {
  const headers: HeadersInit = {
    ...(options?.headers || {}),
  };
  return $fetch<T>(url, {
    baseURL: baseURL(!options?.withoutAuth),
    method: "PUT" as const,
    body,
    ...options,
    headers,
  });
}

/**
 * Generic function to make a DELETE request to the backend API, with optional configuration for headers and authentication.
 * @param url URL to make the request to.
 * @param options Options for configuring the request, including headers and authentication settings.
 * @returns The response data from the API, typed as a generic type T, which allows for flexible handling of different response shapes based on the specific API endpoint being called.
 */
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
 * Returns function for all session related requests but have a different base URL.
 * @param url URL to make the request to.
 * @param data Data to be returned.
 * @param method HTTP method to use for the request, either "GET" or "POST".
 * @param body Request payload, if applicable.
 * @returns The resulting data from the session API.
 */

export const fetchSession = async (
  url: string,
  data: object | undefined,
  method: "GET" | "POST" = "GET",
  body?: object | undefined
) => {
  return $fetch(url, {
    baseURL: "/api/session",
    data,
    headers: {},
    method,
    body,
  });
};
