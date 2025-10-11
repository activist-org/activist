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
 * Checks if the server is ready by making multiple requests and ensuring they're stable
 * This helps avoid issues where Nuxt dev server reloads multiple times during startup
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
      // Make a request to check if server is responding.
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
        // Check if we got HTML content (not an error page).
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          const text = await response.text();

          // Check for signs that the server is still compiling/loading.
          // Only check for actual compilation indicators, not normal app loading states.
          const compilationIndicators = [
            "Compiling...",
            "Building...",
            "Hot Module Replacement",
            "webpack-dev-server",
            "vite-dev-server",
            "webpack is compiling",
            "vite is building",
          ];

          const foundIndicators = compilationIndicators.filter((indicator) =>
            text.includes(indicator)
          );
          if (foundIndicators.length > 0) {
            // eslint-disable-next-line no-console
            console.log(
              `🔍 Found compilation indicators: ${foundIndicators.join(", ")}`
            );
            // eslint-disable-next-line no-console
            console.log(
              `🔍 Response sample with indicators: ${text.substring(0, 1000)}...`
            );
            throw new Error(
              `Server is still compiling/loading: ${foundIndicators.join(", ")}`
            );
          }

          // Check for Nuxt-specific indicators that the app is ready.
          // We need both the Nuxt container and the Nuxt data to be present.
          if (text.includes('id="__nuxt"') && text.includes("__NUXT__")) {
            // eslint-disable-next-line no-console
            console.log(`✅ Server is ready after ${attempts} attempt(s)`);
            return { isReady: true, attempts };
          } else {
            const hasNuxtContainer = text.includes('id="__nuxt"');
            const hasNuxtData = text.includes("__NUXT__");
            // eslint-disable-next-line no-console
            console.log(
              `⚠️  Server responded but missing Nuxt indicators: container=${hasNuxtContainer}, data=${hasNuxtData}`
            );

            // Additional debug: check for compilation indicators that might be false positives.
            const hasLoadingText = text.includes("Loading...");
            const hasLoadingAlt = text.includes("loading the platform");
            const hasViteClient = text.includes("@vite/client");
            // eslint-disable-next-line no-console
            console.log(
              `🔍 Debug - loading indicators: Loading...=${hasLoadingText}, alt text=${hasLoadingAlt}, vite client=${hasViteClient}`
            );

            // Log a sample of the response for debugging.
            const sample = text.substring(0, 500);
            // eslint-disable-next-line no-console
            console.log(`🔍 Response sample: ${sample}...`);
          }
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
