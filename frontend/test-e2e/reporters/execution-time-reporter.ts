// SPDX-License-Identifier: AGPL-3.0-or-later
import type {
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";

interface TestExecutionInfo {
  testName: string;
  projectName: string;
  duration: number;
  status: string;
  suiteName: string;
}

class ExecutionTimeReporter implements Reporter {
  private testExecutions: TestExecutionInfo[] = [];
  private startTime: number = 0;
  private totalDuration: number = 0;

  onBegin(_config: unknown, _suite: Suite) {
    this.startTime = Date.now();
    // eslint-disable-next-line no-console
    console.log("🚀 Starting Playwright test execution...");
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const suiteName = this.getSuiteName(test);
    const projectName = this.getProjectName(test);

    this.testExecutions.push({
      testName: test.title,
      projectName,
      duration: result.duration,
      status: result.status,
      suiteName,
    });
  }

  onEnd(_result: unknown) {
    this.totalDuration = Date.now() - this.startTime;
    this.printExecutionSummary();
  }

  private getSuiteName(test: TestCase): string {
    let currentSuite = test.parent;
    while (currentSuite.parent) {
      if (currentSuite.type === "describe") {
        return currentSuite.title;
      }
      currentSuite = currentSuite.parent;
    }
    return "Unknown Suite";
  }

  private getProjectName(test: TestCase): string {
    let current: Suite | undefined = test.parent;
    while (current) {
      if (current.project) {
        const project = current.project();
        if (project) {
          return project.name;
        }
      }
      current = current.parent;
    }
    return "Unknown Project";
  }

  private printExecutionSummary() {
    // eslint-disable-next-line no-console
    console.log("\n" + "=".repeat(80));
    // eslint-disable-next-line no-console
    console.log("📊 PLAYWRIGHT TEST EXECUTION SUMMARY");
    // eslint-disable-next-line no-console
    console.log("=".repeat(80));

    // Total execution time.
    const totalMinutes = Math.floor(this.totalDuration / 60000);
    const totalSeconds = Math.floor((this.totalDuration % 60000) / 1000);
    const totalMs = this.totalDuration % 1000;

    // eslint-disable-next-line no-console
    console.log(
      `⏱️  Total Execution Time: ${totalMinutes}m ${totalSeconds}s ${totalMs}ms`
    );
    // eslint-disable-next-line no-console
    console.log(`📈 Total Tests: ${this.testExecutions.length}`);

    // Group by project.
    const projectGroups = this.groupByProject();

    // Print summary by project.
    // eslint-disable-next-line no-console
    console.log("\n📋 EXECUTION TIME BY PROJECT:");
    // eslint-disable-next-line no-console
    console.log("-".repeat(29));

    Object.entries(projectGroups).forEach(([projectName, tests]) => {
      const projectDuration = tests.reduce(
        (sum, test) => sum + test.duration,
        0
      );
      const projectMinutes = Math.floor(projectDuration / 60000);
      const projectSeconds = Math.floor((projectDuration % 60000) / 1000);
      const projectMs = Math.floor(projectDuration % 1000);

      const passed = tests.filter((t) => t.status === "passed").length;
      const failed = tests.filter((t) => t.status === "failed").length;
      const skipped = tests.filter((t) => t.status === "skipped").length;

      // eslint-disable-next-line no-console
      console.log(`\n🧪 ${projectName}:`);
      // eslint-disable-next-line no-console
      console.log(
        `   ⏱️  Duration: ${projectMinutes}m ${projectSeconds}s ${projectMs}ms`
      );
      // eslint-disable-next-line no-console
      console.log(
        `   ✅ Passed: ${passed} | ❌ Failed: ${failed} | ⏭️  Skipped: ${skipped}`
      );
    });

    // Print slowest tests.
    const slowestTests = [...this.testExecutions]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);

    if (slowestTests.length > 0) {
      // eslint-disable-next-line no-console
      console.log("\n🐢 SLOWEST TESTS:");
      // eslint-disable-next-line no-console
      console.log("-".repeat(17));
      slowestTests.forEach((test, index) => {
        const seconds = (test.duration / 1000).toFixed(2);
        const statusIcon =
          test.status === "passed"
            ? "✅"
            : test.status === "failed"
              ? "❌"
              : "⏭️ ";
        // eslint-disable-next-line no-console
        console.log(
          `${index + 1}. ${statusIcon} ${test.projectName} - ${test.suiteName}: ${test.testName} (${seconds}s)`
        );
      });
    }

    // Print fastest tests.
    const fastestTests = [...this.testExecutions]
      .filter((t) => t.duration > 0)
      .sort((a, b) => a.duration - b.duration)
      .slice(0, 3);

    if (fastestTests.length > 0) {
      // eslint-disable-next-line no-console
      console.log("\n🐰 FASTEST TESTS:");
      // eslint-disable-next-line no-console
      console.log("-".repeat(17));
      fastestTests.forEach((test, index) => {
        const seconds = (test.duration / 1000).toFixed(2);
        const statusIcon =
          test.status === "passed"
            ? "✅"
            : test.status === "failed"
              ? "❌"
              : "⏭️";
        // eslint-disable-next-line no-console
        console.log(
          `${index + 1}. ${statusIcon} ${test.projectName} - ${test.suiteName}: ${test.testName} (${seconds}s)`
        );
      });
    }

    // Performance insights.
    // eslint-disable-next-line no-console
    console.log("\n💡 PERFORMANCE INSIGHTS:");
    // eslint-disable-next-line no-console
    console.log("-".repeat(24));

    const avgDuration =
      this.testExecutions.reduce((sum, test) => sum + test.duration, 0) /
      this.testExecutions.length;
    const avgSeconds = (avgDuration / 1000).toFixed(2);

    // eslint-disable-next-line no-console
    console.log(`📊 Average test duration: ${avgSeconds}s`);

    const slowTests = this.testExecutions.filter(
      (t) => t.duration > avgDuration * 2
    );
    if (slowTests.length > 0) {
      // eslint-disable-next-line no-console
      console.log(
        `⚠️  ${slowTests.length} tests are significantly slower than average (>${((avgDuration * 2) / 1000).toFixed(2)}s)`
      );
    }

    const failedTests = this.testExecutions.filter(
      (t) => t.status === "failed"
    );
    if (failedTests.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`❌ ${failedTests.length} tests failed`);
    }

    // eslint-disable-next-line no-console
    console.log("=".repeat(80));
    // eslint-disable-next-line no-console
    console.log("🎉 Test execution completed!");
    // eslint-disable-next-line no-console
    console.log("=".repeat(80) + "\n");
  }

  private groupByProject(): Record<string, TestExecutionInfo[]> {
    return this.testExecutions.reduce(
      (groups, test) => {
        if (!groups[test.projectName]) {
          groups[test.projectName] = [];
        }
        groups[test.projectName].push(test);
        return groups;
      },
      {} as Record<string, TestExecutionInfo[]>
    );
  }
}

export default ExecutionTimeReporter;
