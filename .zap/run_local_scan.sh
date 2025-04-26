#!/bin/bash

# Script to run OWASP ZAP scan locally using Docker
# Enhanced for better macOS compatibility

set -eo pipefail  # Exit on errors and pipe failures

# Default values
TARGET_URL="https://www.activist.org/en/"
SCAN_TYPE="full"  # Options: baseline, full, api
OUTPUT_FORMAT="html"  # Options: html, json, xml, md
TIMEOUT=60
MAX_DEPTH=10
ZAP_IMAGE="ghcr.io/zaproxy/zaproxy:stable"

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -t|--target) TARGET_URL="$2"; shift 2 ;;
    -s|--scan-type) SCAN_TYPE="$2"; shift 2 ;;
    -o|--output) OUTPUT_FORMAT="$2"; shift 2 ;;
    -d|--max-depth) MAX_DEPTH="$2"; shift 2 ;;
    -T|--timeout) TIMEOUT="$2"; shift 2 ;;
    -h|--help)
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  -t, --target URL       Target URL to scan (default: https://www.activist.org/en/)"
      echo "  -s, --scan-type TYPE   Scan type: baseline, full, api (default: full)"
      echo "  -o, --output FORMAT    Output format: html, json, xml, md (default: html)"
      echo "  -d, --max-depth DEPTH  Maximum crawl depth (default: 10)"
      echo "  -T, --timeout SECONDS  Timeout in seconds (default: 60)"
      echo "  -h, --help             Show this help message"
      exit 0 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

echo "Starting local OWASP ZAP scan using Docker..."

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "Error: Docker not found. Please install Docker first."
    exit 1
fi

# Validate target URL
if [[ ! "$TARGET_URL" =~ ^https?:// ]]; then
    echo "Error: Target URL must start with http:// or https://"
    exit 1
fi

# Create a temporary directory for reports
REPORTS_DIR="$(pwd)/zap-reports"
mkdir -p "$REPORTS_DIR"
chmod 777 "$REPORTS_DIR"  # Ensure the container can write to this directory

# Create a temporary directory for ZAP working files
TEMP_DIR="$(pwd)/zap-temp"
mkdir -p "$TEMP_DIR"
chmod 777 "$TEMP_DIR"  # Ensure the container can write to this directory

# Get absolute path for volume mounts (more reliable on macOS)
ABS_ZAP_DIR="$(cd "$(dirname "$0")" && pwd)"
ABS_REPORTS_DIR="$(cd "$REPORTS_DIR" && pwd)"
ABS_TEMP_DIR="$(cd "$TEMP_DIR" && pwd)"

# Generate report filename based on scan type and date
TIMESTAMP=$(date +%F-%H%M%S)
REPORT_NAME="zap-${SCAN_TYPE}-scan-${TIMESTAMP}.${OUTPUT_FORMAT}"

echo "Starting scan with the following settings:"
echo "  Target URL:  $TARGET_URL"
echo "  Scan type:   $SCAN_TYPE"
echo "  Output:      $OUTPUT_FORMAT"
echo "  Max depth:   $MAX_DEPTH"
echo "  Timeout:     $TIMEOUT seconds"
echo "  Report:      $REPORT_NAME"
echo "  Report will be saved to: $ABS_REPORTS_DIR/$REPORT_NAME"

# Select the appropriate ZAP script based on scan type
case $SCAN_TYPE in
    baseline) ZAP_SCRIPT="zap-baseline.py" ;;
    full) ZAP_SCRIPT="zap-full-scan.py" ;;
    api) ZAP_SCRIPT="zap-api-scan.py" ;;
    *) echo "Error: Invalid scan type '$SCAN_TYPE'"; exit 1 ;;
esac

# Select output format flags
case $OUTPUT_FORMAT in
    html) OUTPUT_FLAG="-r" ;;
    json) OUTPUT_FLAG="-J" ;;
    xml) OUTPUT_FLAG="-x" ;;
    md) OUTPUT_FLAG="-m" ;;
    *) echo "Error: Invalid output format '$OUTPUT_FORMAT'"; exit 1 ;;
esac

# Show a spinner during scanning
function show_spinner {
    local pid=$1
    local delay=0.75
    local spinstr='|/-\'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

# Run ZAP Docker container
echo "Starting ZAP scan..."
docker run --rm \
  -v "$ABS_ZAP_DIR:/zap/wrk" \
  -v "$ABS_REPORTS_DIR:/zap/reports:rw" \
  -v "$ABS_TEMP_DIR:/zap/temp:rw" \
  --platform linux/amd64 \
  --memory=4g \
  --cpus=2 \
  "$ZAP_IMAGE" \
  "$ZAP_SCRIPT" \
  -t "$TARGET_URL" \
  "$OUTPUT_FLAG" "/zap/reports/$REPORT_NAME" \
  -a -j -T "$TIMEOUT" -m "$MAX_DEPTH" \
  -z "-config scanner.attackStrength=HIGH -config scanner.alertThreshold=MEDIUM" \
  -c /zap/wrk/rules.tsv \
  -d /zap/temp

echo -e "\nScan completed. Report saved to $ABS_REPORTS_DIR/$REPORT_NAME"

# Open the report if it's HTML
if [[ "$OUTPUT_FORMAT" == "html" && -f "$ABS_REPORTS_DIR/$REPORT_NAME" ]]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$ABS_REPORTS_DIR/$REPORT_NAME"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$ABS_REPORTS_DIR/$REPORT_NAME" &>/dev/null || true
    fi
    echo "Report opened in your default browser."
fi

# Clean up temp directory after scan
rm -rf "$TEMP_DIR"
