import type {
  Reporter,
  TestCase,
  TestResult,
  Suite,
} from "@playwright/test/reporter";
import fs from "fs";
import path from "path";
import { createHtmlReport } from "axe-html-reporter";

class AxeReporter implements Reporter {
  private outputDir: string;

  constructor(options?: { outputDir?: string }) {
    this.outputDir = options?.outputDir || "test-results/accessibility-results";
  }

  onTestBegin(test: TestCase) {
    console.log(`Starting test ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Test ended: ${test.title}, Status: ${result.status}`);

    const axeResults = result.attachments.find(
      (a) => a.name === "accessibility-scan-results"
    );
    if (axeResults && axeResults.body) {
      const results = JSON.parse(axeResults.body.toString());
      console.log(`Violations found: ${results.violations.length}`);

      if (results.violations.length > 0) {
        console.log(`Generating report for: ${test.title}`);
        const pageName = this.extractPageName(test);
        const { browserName, deviceName } = this.extractProjectInfo(test);
        this.generateAxeReport(results, pageName, browserName, deviceName);
      } else {
        console.log(
          `Skipping report generation for test with no violations: ${test.title}`
        );
      }
    } else {
      console.log(`No accessibility results found for: ${test.title}`);
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
    results: any,
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
        outputDir: this.outputDir,
      },
    });
  }
}

export default AxeReporter;
