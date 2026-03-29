// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Server readiness utilities for E2E tests
 * Ensures the Nuxt dev server is fully warmed up before tests start
 */

export interface ServerReadinessOptions {
  baseURL: string;
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

export interface ServerReadinessResult {
  isReady: boolean;
  attempts: number;
  lastError?: string;
}

/**
 * Checks if the frontend server is ready by verifying it returns an HTML 200 response.
 * Works for both Nuxt dev server and static builds served by `serve`.
 */
export async function checkServerReadiness(
  options: ServerReadinessOptions
): Promise<ServerReadinessResult> {
  const {
    baseURL,
    maxRetries = 10,
    retryDelay = 2000,
    timeout = 10000,
  } = options;

  let attempts = 0;
  let lastError: string | undefined;

  // eslint-disable-next-line no-console
  console.log(`🔍 Checking server readiness at ${baseURL}...`);

  while (attempts < maxRetries) {
    attempts++;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${baseURL}/`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "User-Agent": "Playwright-E2E-Test/1.0",
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          // eslint-disable-next-line no-console
          console.log(`✅ Server is ready after ${attempts} attempt(s)`);
          return { isReady: true, attempts };
        }
      }

      throw new Error(`Server responded with status ${response.status}`);
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);

      if (attempts < maxRetries) {
        // eslint-disable-next-line no-console
        console.log(
          `⏳ Attempt ${attempts}/${maxRetries} failed: ${lastError}. Retrying in ${retryDelay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  // eslint-disable-next-line no-console
  console.error(
    `❌ Server readiness check failed after ${attempts} attempts. Last error: ${lastError}`
  );
  return { isReady: false, attempts, lastError };
}

/**
 * Waits for the server to be ready with exponential backoff
 */
export async function waitForServerReady(
  options: ServerReadinessOptions
): Promise<void> {
  const result = await checkServerReadiness(options);

  if (!result.isReady) {
    throw new Error(
      `Server is not ready after ${result.attempts} attempts. ` +
        `Last error: ${result.lastError}`
    );
  }
}

/**
 * Quick server health check - just verifies the server responds
 */
export async function quickServerHealthCheck(
  baseURL: string
): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${baseURL}/`, {
      method: "HEAD",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}
