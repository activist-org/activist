# OWASP ZAP Security Testing Configuration

This directory contains configuration files for OWASP ZAP security testing, optimized according to security best practices.

## Configuration Overview

The security testing is configured to focus on the most effective and critical security tests while reducing false positives and noise.

### Key Features

- **High Attack Strength**: Configured to use HIGH attack strength for more thorough testing
- **Medium Alert Threshold**: Set to MEDIUM to balance between finding important vulnerabilities and reducing false positives
- **Optimized Scan Time**: Set to 60 minutes maximum with 10 threads for efficient scanning
- **Weekly Scheduled Scans**: Automatically runs every Monday at 2 AM UTC
- **Custom Rules**: Excludes tests known to produce false positives or less critical findings

## Rules File Explanation

The `rules.tsv` file contains a list of rules that are either included or excluded from the scan. The format is:

```
[rule ID]  [IGNORE/WARN/FAIL]  [URL regex]  [Description]
```

### Excluded Rules Rationale

We've excluded certain rules for the following reasons:

1. **Header-related checks** (10020, 10021, 10038, 10063): These are often handled by CDNs or WAFs in production
2. **Information disclosure** (90022, 10096, 40032, 2): These often produce false positives
3. **Non-critical issues** (10049, 10109): These are informational and not security vulnerabilities
4. **Complex analysis** (10055, 10202, 10104): These require manual verification and often produce false positives

## Best Practices Implemented

1. **Focus on Critical Vulnerabilities**: Prioritizing OWASP Top 10 vulnerabilities
2. **Reduced False Positives**: Excluding rules known to produce noise
3. **Regular Scanning**: Weekly automated scans
4. **Non-Blocking**: Security findings are reported but don't block the workflow
5. **High Attack Strength**: More thorough testing for critical endpoints

## Recommended Follow-up

- Review security reports weekly
- Perform manual verification of findings
- Consider adding authenticated scanning for protected areas
- Update excluded rules based on application changes
