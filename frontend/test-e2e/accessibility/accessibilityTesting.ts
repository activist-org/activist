// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, TestInfo } from "@playwright/test";

import AxeBuilder from "@axe-core/playwright";

/**
 * Run axe on the entire page and attach results to the test info for reporting.
 * @param pageName - A descriptive name for the page being tested, used in the attachment name.
 * @param page - Playwright page object to run the accessibility scan on.
 * @param testInfo - Playwright TestInfo object to attach the results to.
 * @returns An array of formatted accessibility violations found on the page, with details for each violation and affected nodes.
 */
export async function runAccessibilityTest(
  pageName: string,
  page: Page,
  testInfo: TestInfo
) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  await testInfo.attach("accessibility-scan-results", {
    body: JSON.stringify(results, null, 2),
    contentType: "application/json",
  });

  const formattedViolations = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    description: violation.description,
    help: violation.help,
    nodes: violation.nodes.map((node) => ({
      html: node.html,
      failureSummary: node.failureSummary,
    })),
  }));

  return formattedViolations;
}

export type AccessibilityScopedOptions = {
  /** e.g. disable `button-name` for third-party controls (v-calendar nav arrows). */
  disableRules?: string[];
};

/**
 * Run axe on a subtree only (e.g. an open modal) to avoid unrelated page noise.
 * @param pageName - A descriptive name for the page/section being tested, used in the attachment name.
 * @param page - Playwright page object to run the accessibility scan on.
 * @param testInfo - Playwright TestInfo object to attach the results to.
 * @param rootCssSelector - CSS selector for the root of the subtree to test (e.g. a modal container).
 * @param options - Optional configuration for the accessibility test, such as rules to disable.
 * @returns An array of formatted accessibility violations found within the specified subtree, with details for each violation and affected nodes.
 */
export async function runAccessibilityTestScoped(
  pageName: string,
  page: Page,
  testInfo: TestInfo,
  rootCssSelector: string,
  options?: AccessibilityScopedOptions
) {
  let builder = new AxeBuilder({ page })
    .include(rootCssSelector)
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]);
  if (options?.disableRules?.length) {
    builder = builder.disableRules(options.disableRules);
  }
  const results = await builder.analyze();

  const safeName = pageName.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "");
  await testInfo.attach(`accessibility-scan-results-${safeName}`, {
    body: JSON.stringify(results, null, 2),
    contentType: "application/json",
  });

  return results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    description: violation.description,
    help: violation.help,
    nodes: violation.nodes.map((node) => ({
      html: node.html,
      failureSummary: node.failureSummary,
    })),
  }));
}
