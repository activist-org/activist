// SPDX-License-Identifier: AGPL-3.0-or-later
import type { TestInfo } from "@playwright/test";
import { test } from "@playwright/test";

/**
 * Test traceability helpers (console + Playwright traces).
 */

/**
 * Logs the full test hierarchy for better debugging and reporting
 * @param testInfo - Playwright test info object
 * @param additionalContext - Optional additional context to log
 */
export function logTestPath(
  testInfo: TestInfo,
  additionalContext?: string
): void {
  const testPath = testInfo.titlePath.join(" > ");
  const context = additionalContext ? ` (${additionalContext})` : "";
  // eslint-disable-next-line no-console
  console.log(`🧪 Running test: ${testPath}${context}`);
}

/**
 * Named step for **HTML report + trace viewer** (`test.step`).
 * `testInfo` is kept for call-site compatibility; use `logTestPath(testInfo)` when you need console hierarchy.
 */
export async function withTestStep<T>(
  _testInfo: TestInfo,
  stepName: string,
  stepFunction: () => Promise<T>
): Promise<T> {
  return test.step(stepName, stepFunction);
}

/**
 * Logs test failure with full context
 * @param testInfo - Playwright test info object
 * @param error - The error that occurred
 * @param additionalContext - Optional additional context
 */
export function logTestFailure(
  testInfo: TestInfo,
  error: Error,
  additionalContext?: string
): void {
  const testPath = testInfo.titlePath.join(" > ");
  const context = additionalContext ? ` (${additionalContext})` : "";
  // eslint-disable-next-line no-console
  console.error(`❌ Test failed: ${testPath}${context}`);
  // eslint-disable-next-line no-console
  console.error(`   Error: ${error.message}`);
}
