// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page, TestInfo } from "@playwright/test";

import AxeBuilder from "@axe-core/playwright";

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
