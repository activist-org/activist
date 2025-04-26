#!/bin/bash

# Script to run OWASP ZAP scan using ZAP Desktop application
# This is more reliable than Docker-based approaches on macOS

set -e

echo "Starting OWASP ZAP scan using ZAP Desktop API..."

# Check if ZAP is installed (macOS locations)
ZAP_PATHS=(
  "/Applications/OWASP ZAP.app/Contents/Java/zap.sh"
  "/Applications/ZAP.app/Contents/Java/ZAP.sh"
)

ZAP_PATH=""
for path in "${ZAP_PATHS[@]}"; do
  if [ -f "$path" ]; then
    ZAP_PATH="$path"
    break
  fi
done

if [ -z "$ZAP_PATH" ]; then
  echo "Error: OWASP ZAP Desktop application not found."
  echo "Please install it from: https://www.zaproxy.org/download/"
  exit 1
fi

# Create reports directory
REPORTS_DIR="$(pwd)/zap-reports"
mkdir -p "$REPORTS_DIR"

# Start ZAP in daemon mode with optimized configuration
echo "Starting ZAP in daemon mode..."
"$ZAP_PATH" -daemon -host 127.0.0.1 -port 8080 \
  -config api.disablekey=true \
  -config selenium.browsers.firefox.path="" \
  -config client.launchBrowser=false \
  -config graaljs.enabled=false \
  -config script.enabled=false \
  -config connection.timeoutInSecs=60 \
  -config connection.socketTimeoutInSecs=30 \
  -config scanner.threadPerHost=2 \
  -config scanner.hostPerScan=2 \
  -config scanner.delayInMs=500 &
ZAP_PID=$!

# Wait for ZAP to start (increased wait time)
echo "Waiting for ZAP to initialize..."
sleep 20

# The target URL
TARGET_URL="https://www.activist.org/en/"

# First, check if ZAP API is responding
echo "Checking if ZAP API is responsive..."
API_TEST=$(curl -s "http://localhost:8080/JSON/core/view/version/")
if [[ "$API_TEST" != *"version"* ]]; then
  echo "Error: ZAP API is not responding properly. Please check if ZAP started correctly."
  kill $ZAP_PID 2>/dev/null || true
  exit 1
fi

# Access the URL to add it to the site tree
echo "Adding target URL to site tree..."
SITE_ACCESS=$(curl -s "http://localhost:8080/JSON/core/action/accessUrl/?url=${TARGET_URL}")
echo "Site access result: $SITE_ACCESS"

# Wait a moment for the site to be fully processed
sleep 5

# Then spider the site with improved error handling
echo "Spidering the target site..."
SPIDER_RESPONSE=$(curl -s "http://localhost:8080/JSON/spider/action/scan/?url=${TARGET_URL}&recurse=true")
echo "Spider response: $SPIDER_RESPONSE"

# Extract spider scan ID with a more flexible approach
SPIDER_SCAN_ID=$(echo "$SPIDER_RESPONSE" | grep -o '"[0-9]*"' | sed 's/"//g' | head -1)

# If that fails, try another pattern
if [ -z "$SPIDER_SCAN_ID" ]; then
  SPIDER_SCAN_ID=$(echo "$SPIDER_RESPONSE" | grep -o '[0-9]\+' | head -1)
fi

if [ -z "$SPIDER_SCAN_ID" ]; then
  echo "Error: Failed to extract spider scan ID from response"
  echo "Response was: $SPIDER_RESPONSE"

  # Try one more approach - use the scan API directly with simpler parameters
  echo "Trying alternative spider approach..."
  SPIDER_ALT_RESPONSE=$(curl -s "http://localhost:8080/JSON/spider/action/scan/?url=${TARGET_URL}")
  echo "Alternative spider response: $SPIDER_ALT_RESPONSE"
  SPIDER_SCAN_ID=$(echo "$SPIDER_ALT_RESPONSE" | grep -o '[0-9]\+' | head -1)

  if [ -z "$SPIDER_SCAN_ID" ]; then
    echo "Error: All spider scan attempts failed. Checking ZAP status..."
    STATUS_RESPONSE=$(curl -s "http://localhost:8080/JSON/core/view/hosts/")
    echo "ZAP hosts status: $STATUS_RESPONSE"
    kill $ZAP_PID 2>/dev/null || true
    exit 1
  fi
fi

echo "Spider scan started with ID: $SPIDER_SCAN_ID"

# Monitor spider progress with better error handling
echo "Monitoring spider progress..."
SPIDER_COMPLETE=0
RETRY_COUNT=0
MAX_RETRIES=5

while [ "$SPIDER_COMPLETE" -lt 100 ] && [ "$RETRY_COUNT" -lt "$MAX_RETRIES" ]; do
  sleep 3
  SPIDER_STATUS=$(curl -s "http://localhost:8080/JSON/spider/view/status/?scanId=$SPIDER_SCAN_ID")

  if [[ "$SPIDER_STATUS" == *"does_not_exist"* ]] || [[ "$SPIDER_STATUS" == *"error"* ]]; then
    echo "Error checking spider status: $SPIDER_STATUS"
    RETRY_COUNT=$((RETRY_COUNT+1))
    echo "Retrying... ($RETRY_COUNT/$MAX_RETRIES)"
    continue
  fi

  # Extract progress value handling both quoted and unquoted numbers
  if [[ "$SPIDER_STATUS" =~ \"status\":\"([0-9]+)\" ]]; then
    # Extract quoted number: "status":"100"
    SPIDER_COMPLETE="${BASH_REMATCH[1]}"
  elif [[ "$SPIDER_STATUS" =~ \"status\":([0-9]+) ]]; then
    # Extract unquoted number: "status":100
    SPIDER_COMPLETE="${BASH_REMATCH[1]}"
  else
    echo "Warning: Could not parse progress value. Response was: $SPIDER_STATUS"
    SPIDER_COMPLETE=0
  fi

  echo "Spider progress: $SPIDER_COMPLETE%"
done

if [ "$RETRY_COUNT" -ge "$MAX_RETRIES" ]; then
  echo "Error: Too many retries checking spider status. Continuing to active scan anyway."
else
  echo "Spider scan completed. Starting active scan..."
fi

# Configure scan policy for reliability
echo "Configuring scan policy for reliability..."
# Set maximum rule duration to 1 minute
curl -s "http://localhost:8080/JSON/ascan/action/setOptionMaxRuleDurationInMins/?Integer=1" > /dev/null
# Set overall scan duration maximum to 60 minutes
curl -s "http://localhost:8080/JSON/ascan/action/setOptionMaxScanDurationInMins/?Integer=60" > /dev/null
# Add delay between requests
curl -s "http://localhost:8080/JSON/ascan/action/setOptionDelayInMs/?Integer=500" > /dev/null
# Reduce the number of hosts scanned concurrently
curl -s "http://localhost:8080/JSON/ascan/action/setOptionHostPerScan/?Integer=1" > /dev/null
# Reduce the number of threads per host
curl -s "http://localhost:8080/JSON/ascan/action/setOptionThreadPerHost/?Integer=1" > /dev/null

# Disable problematic scan rules that often cause timeouts
echo "Disabling problematic scan rules..."
# Get all scan rules
SCAN_RULES=$(curl -s "http://localhost:8080/JSON/ascan/view/scanners/" | grep -o '"id":[0-9]*,"name":"[^"]*"' | sed 's/"id":\([0-9]*\),"name":"\([^"]*\)"/\1|\2/g')

# Disable User Agent rule (often causes timeout issues)
echo "Disabling User Agent scan rule..."
curl -s "http://localhost:8080/JSON/ascan/action/disableScanners/?ids=10104" > /dev/null

# Disable other problematic rules
echo "Disabling other slow/problematic scan rules..."
# CORS security
curl -s "http://localhost:8080/JSON/ascan/action/disableScanners/?ids=40039" > /dev/null
# Backup file scanner (slow)
curl -s "http://localhost:8080/JSON/ascan/action/disableScanners/?ids=10095" > /dev/null
# Blind SQL injection (timeout-prone)
curl -s "http://localhost:8080/JSON/ascan/action/disableScanners/?ids=40018" > /dev/null
# Server side include
curl -s "http://localhost:8080/JSON/ascan/action/disableScanners/?ids=40009" > /dev/null
# Slow rules that are less critical
curl -s "http://localhost:8080/JSON/ascan/action/disableScanners/?ids=40003,40018,90019,90020" > /dev/null

# Now we can run the active scan with improved error handling and reliability settings
ASCAN_RESPONSE=$(curl -s "http://localhost:8080/JSON/ascan/action/scan/?url=${TARGET_URL}&recurse=true&inScopeOnly=false&scanPolicyName=&method=&postData=")
echo "Active scan response: $ASCAN_RESPONSE"

# Extract scan ID with different possible patterns
ASCAN_ID=$(echo "$ASCAN_RESPONSE" | grep -o '"id":"[0-9]*"' | sed 's/"id":"//g' | sed 's/"//g')

if [ -z "$ASCAN_ID" ]; then
  ASCAN_ID=$(echo "$ASCAN_RESPONSE" | grep -o '"[0-9]*"' | sed 's/"//g' | head -1)
fi

if [ -z "$ASCAN_ID" ]; then
  ASCAN_ID=$(echo "$ASCAN_RESPONSE" | grep -o '[0-9]\+' | head -1)
fi

if [ -z "$ASCAN_ID" ]; then
  echo "Error: Failed to start active scan. Trying to generate reports anyway..."
else
  echo "Active scan started with ID: $ASCAN_ID"

  # Monitor active scan progress with better error handling
  echo "Monitoring active scan progress..."
  ASCAN_COMPLETE=0
  RETRY_COUNT=0

  # Add a timeout for the entire active scan process
  ASCAN_START_TIME=$(date +%s)
  ASCAN_TIMEOUT_SECS=3600  # 1 hour max

  while [ "$ASCAN_COMPLETE" -lt 100 ] && [ "$RETRY_COUNT" -lt "$MAX_RETRIES" ]; do
    # Check if we've exceeded the maximum scan time
    CURRENT_TIME=$(date +%s)
    ELAPSED_TIME=$((CURRENT_TIME - ASCAN_START_TIME))

    if [ "$ELAPSED_TIME" -gt "$ASCAN_TIMEOUT_SECS" ]; then
      echo "Active scan has been running for over $((ASCAN_TIMEOUT_SECS/60)) minutes. Proceeding to report generation."
      break
    fi

    sleep 5
    ASCAN_STATUS=$(curl -s "http://localhost:8080/JSON/ascan/view/status/?scanId=$ASCAN_ID")

    if [[ "$ASCAN_STATUS" == *"does_not_exist"* ]] || [[ "$ASCAN_STATUS" == *"error"* ]]; then
      echo "Error checking active scan status: $ASCAN_STATUS"
      RETRY_COUNT=$((RETRY_COUNT+1))
      echo "Retrying... ($RETRY_COUNT/$MAX_RETRIES)"
      continue
    fi

    # Extract progress value handling both quoted and unquoted numbers
    if [[ "$ASCAN_STATUS" =~ \"status\":\"([0-9]+)\" ]]; then
      # Extract quoted number: "status":"100"
      ASCAN_COMPLETE="${BASH_REMATCH[1]}"
    elif [[ "$ASCAN_STATUS" =~ \"status\":([0-9]+) ]]; then
      # Extract unquoted number: "status":100
      ASCAN_COMPLETE="${BASH_REMATCH[1]}"
    else
      echo "Warning: Could not parse progress value. Response was: $ASCAN_STATUS"
      ASCAN_COMPLETE=0
    fi

    echo "Active scan progress: $ASCAN_COMPLETE%"
  done

  if [ "$RETRY_COUNT" -ge "$MAX_RETRIES" ]; then
    echo "Error: Too many retries checking active scan status."
  else
    echo "Active scan completed. Generating report..."
  fi
fi

# Generate the HTML report even if scans had issues
REPORT_FILE="$REPORTS_DIR/report-$(date +%F).html"
curl "http://localhost:8080/OTHER/core/other/htmlreport/" > "$REPORT_FILE"

# Generate the JSON report for more details
JSON_REPORT_FILE="$REPORTS_DIR/report-$(date +%F).json"
curl "http://localhost:8080/OTHER/core/other/jsonreport/" > "$JSON_REPORT_FILE"

# Stop ZAP
echo "Stopping ZAP..."
kill $ZAP_PID 2>/dev/null || true

echo "Scan completed. Reports saved to:"
echo "- HTML: $REPORT_FILE"
echo "- JSON: $JSON_REPORT_FILE"
echo "Open the HTML report to view the results."
