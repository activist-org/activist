#!/bin/bash
#!/bin/bash
set -e

# Default values or pass as parameters
PORT=${1:-"3000"}
REPORT_FILE=${2:-"zap-report.html"}

echo "Running OWASP ZAP scan against host.docker.internal:$PORT"
echo "Results will be in $REPORT_FILE"

docker run --rm \
  -v $(pwd):/zap/wrk/:rw \
  -t ghcr.io/zaproxy/zaproxy:stable zap-full-scan.py \
  -t "http://host.docker.internal:$PORT" \
  -r "$REPORT_FILE" \
  -I

echo "Scan complete. Check $REPORT_FILE for results."
