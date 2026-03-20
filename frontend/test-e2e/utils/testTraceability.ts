// SPDX-License-Identifier: AGPL-3.0-or-later
import type { TestInfo } from "@playwright/test";

/**
 * Enhanced test traceability utilities using Playwright 1.55.1 features
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
 * Creates a test step with enhanced traceability
 * @param testInfo - Playwright test info object
 * @param stepName - Name of the test step
 * @param stepFunction - Function to execute for the step
 */
export async function withTestStep<T>(
  testInfo: TestInfo,
  stepName: string,
  stepFunction: () => Promise<T>
): Promise<T> {
  // eslint-disable-next-line no-console
  console.log(`  ➡️  Step: ${stepName}`);
  return await stepFunction();
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
