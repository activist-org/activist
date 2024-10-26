import type { Page, TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PageObjectBase } from "./PageObjectBase";

export async function runAccessibilityTest(page: Page | PageObjectBase, testInfo: TestInfo) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  await testInfo.attach("accessibility-scan-results", {
    body: JSON.stringify(results, null, 2),
    contentType: "application/json",
  });
  const pageName = 'getPageName' in page ? await page.getPageName() : 'Unknown Page';
  console.log(`Accessibility test completed for: ${pageName}`);
  console.log(`Violations found: ${results.violations.length}`);

  const formattedViolations = results.violations.map(violation => ({
    id: violation.id,
    impact: violation.impact,
    description: violation.description,
    help: violation.help,
    nodes: violation.nodes.map(node => ({
      html: node.html,
      failureSummary: node.failureSummary
    }))
  }));

  return formattedViolations;
}
