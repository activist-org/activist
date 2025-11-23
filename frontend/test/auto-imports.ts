// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Auto-import mock generator for Vitest tests
 *
 * Dynamically reads .nuxt/imports.d.ts and provides default mocks
 * for all use* composables that aren't already mocked.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Extracts all use* composable names from .nuxt/imports.d.ts
 */
function extractComposableNames(importsContent: string): Set<string> {
  const composables = new Set<string>();

  // Match export statements: export { useSomething, useOther } from '...'
  // Also matches: export { useSomething as alias } from '...'
  const exportPattern = /export\s+{\s*([^}]+)\s*}\s+from/g;
  let match;

  while ((match = exportPattern.exec(importsContent)) !== null) {
    const exports = match[1];
    // Split by comma and extract function names
    const functions = exports
      .split(",")
      .map((f) => f.trim())
      // Filter to only use* functions (use followed by uppercase letter)
      .filter((f) => /^use[A-Z]/.test(f))
      // Handle cases like "useSomething as somethingElse" - take the original name
      .map((f) => {
        const parts = f.split(/\s+as\s+/);
        return parts[0].trim();
      });

    functions.forEach((fn) => composables.add(fn));
  }

  return composables;
}

/**
 * Default mock factory for composables
 * Returns a function that returns an empty object by default
 * This prevents "ReferenceError" when new composables are used but not yet mocked
 */
function createDefaultMock(): () => Record<string, unknown> {
  return () => ({});
}

/**
 * Sets up default mocks for all auto-imported composables that don't already have mocks
 * This should be called in test/setup.ts AFTER custom mocks are set up,
 * so custom mocks take precedence over defaults
 */
export function setupAutoImportMocks(): void {
  const importsFile = join(__dirname, "..", ".nuxt", "imports.d.ts");

  // If imports.d.ts doesn't exist, fail silently
  // This can happen if Nuxt hasn't generated the file yet
  if (!existsSync(importsFile)) {
    return;
  }

  try {
    const importsContent = readFileSync(importsFile, "utf-8");
    const composables = extractComposableNames(importsContent);
    // Create default mocks for all composables that aren't already mocked
    for (const composable of composables) {
      // Only create a default mock if one doesn't already exist
      // This allows custom mocks in setup.ts to override the defaults
      if (!(composable in globalThis)) {
        (globalThis as Record<string, unknown>)[composable] =
          createDefaultMock();
      }
    }
  } catch {
    // If file can't be read or parsed, fail silently
    // Worst case: manual mocks still work
    // This prevents test setup from failing if there's an issue with the imports file
  }
}
