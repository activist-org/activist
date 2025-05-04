# OWASP ZAP Security Testing Configuration

This directory contains configuration files for OWASP ZAP security testing, optimized according to security best practices.

## Configuration Overview

The security testing is configured to focus on the most effective and critical security tests while reducing false positives and noise.

### Key Features

- **Automation Framework**: Uses ZAP's modern automation framework with YAML configuration
- **High Attack Strength**: Configured to use HIGH attack strength for more thorough testing
- **Medium Alert Threshold**: Set to MEDIUM to balance between finding important vulnerabilities and reducing false positives
- **AJAX Spider**: Includes both standard and AJAX spidering for comprehensive coverage
- **Optimized Scan Time**: Efficient scanning with configured timeouts and depth limits
- **Weekly Scheduled Scans**: Automatically runs every Monday at 2 AM UTC via GitHub Actions
- **Custom Alert Filters**: Excludes tests known to produce false positives or less critical findings

## ZAP Automation Configuration

The `zap.yaml` file defines the entire security testing workflow, including:

1. **Context Definition**: Target URLs and scan boundaries
2. **Spidering**: Both traditional and AJAX spidering to discover endpoints
3. **Passive Scanning**: Analyzes responses for security issues without sending additional requests
4. **Active Scanning**: Sends crafted requests to test for vulnerabilities
5. **Alert Filtering**: Manages false positives and categorizes findings
6. **Reporting**: Generates standardized HTML and JSON reports

### Alert Filtering

We've excluded certain alerts that are typically false positives or lower risk:

```yaml
alertFilters:
  - ruleId: 10016     # Cross-Domain Misconfiguration
    newRisk: "False Positive"
  - ruleId: 10020     # X-Frame-Options Header
    newRisk: "False Positive"
  # ... additional filters
```

## Usage Instructions

### Running a Scan Locally

To run a scan locally using Docker:

```bash
# Basic scan with default settings
./run_local_scan.sh

# Scan a specific target
./run_local_scan.sh -t https://example.com

# Customize the scan
./run_local_scan.sh -t https://example.com -o json -d 15 -T 120
```

Options:
- `-t, --target URL`: Target URL to scan (default: https://www.activist.org/en/)
- `-o, --output FORMAT`: Output format: html, json, xml, md (default: html)
- `-d, --max-depth DEPTH`: Maximum crawl depth (default: 10)
- `-T, --timeout SECONDS`: Timeout in seconds (default: 60)

### Using Docker Compose

You can also run the scan using Docker Compose:

```bash
cd .zap
docker-compose up
```

### Testing GitHub Actions Locally with Act

To test the GitHub Actions workflow locally before pushing to GitHub:

```bash
# Run the GitHub Actions workflow locally using Act
./.zap/run_with_act.sh
```

This uses the [Act](https://github.com/nektos/act) tool to simulate GitHub Actions on your local machine. It will execute the same workflow that would run in CI/CD, allowing you to verify your configuration changes work correctly.

### Running with ZAP Desktop UI

If you prefer a graphical interface for exploring the scan results or want more interactive control:

```bash
# Start ZAP with the desktop UI
./.zap/run_with_zap_desktop.sh
```

This launches the ZAP Desktop application in a Docker container, with:
- Pre-configured proxy settings
- The target application loaded
- Access to the full ZAP interface for manual testing
- Persistence of ZAP session data

You can use the desktop UI to:
- Explore discovered endpoints
- Examine specific alerts in detail
- Run targeted scans on specific functionality
- Use manual testing tools like the intercepting proxy

### GitHub Actions Integration

The scan runs automatically in GitHub Actions via the workflow in `.github/workflows/owasp_zap_full_scan.yaml`.

You can also trigger it manually from the GitHub Actions tab by selecting the "OWASP ZAP Optimized Security Scan" workflow and clicking "Run workflow".

## Customizing the Scan

To modify the scan configuration, edit the `zap.yaml` file. Common customizations include:

1. **Changing Target URLs**: Update the URLs in the `contexts` section
2. **Adjusting Spider Depth**: Modify `maxDepth` or `maxCrawlDepth` parameters
3. **Adding Alert Filters**: Add new entries to the `alertFilters` section
4. **Changing Scan Intensity**: Modify the `strength` and `threshold` parameters

## Best Practices

1. **Start with Low Depth**: Begin with a lower spider depth and increase gradually
2. **Review Reports Carefully**: Examine all findings, especially those marked as High risk
3. **Update Alert Filters**: Continuously refine the alert filters based on findings
4. **Scan Regularly**: Run scans after significant changes to the application
5. **Combine with Other Tools**: ZAP is powerful but should be part of a broader security strategy
