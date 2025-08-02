// SPDX-License-Identifier: AGPL-3.0-or-later
import type {
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";
import type { AxeResults } from "axe-core";

import { createHtmlReport } from "axe-html-reporter";

import { RESULTS_PATH } from "~/playwright.config";

class AxeReporter implements Reporter {
  private outputDirPath: string;

  constructor(options?: { outputDirPath?: string }) {
    this.outputDirPath = options?.outputDirPath || RESULTS_PATH;
  }

  onTestBegin(_test: TestCase) {
    // Placeholder
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const axeResults = result.attachments.find(
      (a) => a.name === "accessibility-scan-results"
    );
    if (axeResults && axeResults.body) {
      const results = JSON.parse(axeResults.body.toString());

      if (results.violations.length > 0) {
        const pageName = this.extractPageName(test);
        const { browserName, deviceName } = this.extractProjectInfo(test);
        this.generateAxeReport(results, pageName, browserName, deviceName);
      } else {
        // Placeholder
      }
    } else {
      // Placeholder
    }
  }

  private extractPageName(test: TestCase): string {
    let currentSuite = test.parent;
    while (currentSuite.parent) {
      if (currentSuite.type === "describe") {
        return currentSuite.title.replace(/\s+/g, "_");
      }
      currentSuite = currentSuite.parent;
    }
    return "unknown_page";
  }

  private extractProjectInfo(test: TestCase): {
    browserName: string;
    deviceName: string;
  } {
    let current: Suite | undefined = test.parent;
    while (current) {
      if (current.project) {
        const project = current.project();
        if (project) {
          const projectName = project.name;
          const [browserName, ...deviceParts] = projectName.split(" ");
          return {
            browserName: browserName.replace(/\s+/g, "_"),
            deviceName:
              deviceParts.length > 0 ? deviceParts.join("_") : "desktop",
          };
        }
      }
      current = current.parent;
    }
    return { browserName: "unknown_browser", deviceName: "unknown_device" };
  }

  generateAxeReport(
    results: AxeResults,
    pageName: string,
    browserName: string,
    deviceName: string
  ) {
    const reportFileName = `${pageName}_${browserName}_${deviceName}_axe_report.html`;

    createHtmlReport({
      results,
      options: {
        projectKey: "Activist",
        customSummary: `Accessibility report for ${pageName} - ${browserName}`,
        doNotCreateReportFile: false,
        reportFileName: reportFileName,
        outputDirPath: this.outputDirPath,
        outputDir: "accessibility-results",
      },
    });
  }
}

export default AxeReporter;
