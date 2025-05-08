#!/bin/bash

# Script to run OWASP ZAP scan locally using Docker.
# Enhanced for better macOS compatibility with verbose logging.

set -eo pipefail # exit on errors and pipe failures

# Add verbose logging.
VERBOSE=true

function log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] $1"
}

function log_debug() {
    if [ "$VERBOSE" = true ]; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') [DEBUG] $1"
    fi
}

function log_error() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [ERROR] $1" >&2
}

# MARK: Defaults

TARGET_URL="https://www.activist.org/en/"
OUTPUT_FORMAT="html" # html, json, xml, md
TIMEOUT=60
MAX_DEPTH=10
ZAP_IMAGE="ghcr.io/zaproxy/zaproxy:stable"

# MARK: Parse CLI Args

log_debug "Parsing command-line arguments"
while [[ $# -gt 0 ]]; do
    case $1 in
    -t | --target)
        TARGET_URL="$2"
        log_debug "Set target URL: $TARGET_URL"
        shift 2
        ;;
    -o | --output)
        OUTPUT_FORMAT="$2"
        log_debug "Set output format: $OUTPUT_FORMAT"
        shift 2
        ;;
    -d | --max-depth)
        MAX_DEPTH="$2"
        log_debug "Set max depth: $MAX_DEPTH"
        shift 2
        ;;
    -T | --timeout)
        TIMEOUT="$2"
        log_debug "Set timeout: $TIMEOUT"
        shift 2
        ;;
    -h | --help)
        echo "Usage: $0 [options]"
        echo "Options:"
        echo "  -t, --target URL       Target URL to scan (default: https://www.activist.org/en/)"
        echo "  -o, --output FORMAT    Output format: html, json, xml, md (default: html)"
        echo "  -d, --max-depth DEPTH  Maximum crawl depth (default: 10)"
        echo "  -T, --timeout SECONDS  Timeout in seconds (default: 60)"
        echo "  -h, --help             Show this help message"
        exit 0
        ;;
    *)
        log_error "Unknown option: $1"
        exit 1
        ;;
    esac
done

log "Starting local OWASP ZAP scan using Docker..."

# MARK: Check for Docker

log_debug "Checking if Docker is installed"
if ! command -v docker &>/dev/null; then
    log_error "Error: Docker not found. Please install Docker first."
    exit 1
fi

log_debug "Checking if Docker is running"
if ! docker info &>/dev/null; then
    log_error "Error: Docker is not running. Please start Docker."
    exit 1
fi

# MARK: Validate Target URL

log_debug "Validating target URL: $TARGET_URL"
if [[ ! "$TARGET_URL" =~ ^https?:// ]]; then
    log_error "Error: Target URL must start with http:// or https://"
    exit 1
fi

# MARK: Create Reports Dir

log_debug "Setting up report directory"
REPORTS_DIR="$(pwd)/zap-reports"
mkdir -p "$REPORTS_DIR"
chmod 777 "$REPORTS_DIR" # ensure the container can write to this directory
log_debug "Created reports directory: $REPORTS_DIR"

# MARK: Create Working Files Dir

log_debug "Setting up temp directory"
TEMP_DIR="$(pwd)/zap-temp"
mkdir -p "$TEMP_DIR"
chmod 777 "$TEMP_DIR" # ensure the container can write to this directory
log_debug "Created temp directory: $TEMP_DIR"

# MARK: Gets Paths

# Get absolute path for volume mounts (more reliable on macOS).
log_debug "Getting absolute paths for volume mounts"
ABS_ZAP_DIR="$(cd "$(dirname "$0")" && pwd)"
ABS_REPORTS_DIR="$(cd "$REPORTS_DIR" && pwd)"
ABS_TEMP_DIR="$(cd "$TEMP_DIR" && pwd)"
log_debug "ZAP DIR: $ABS_ZAP_DIR"
log_debug "REPORTS DIR: $ABS_REPORTS_DIR"
log_debug "TEMP DIR: $ABS_TEMP_DIR"

# MARK: Generate Report

TIMESTAMP=$(date +%F-%H%M%S)
REPORT_NAME="zap-scan-${TIMESTAMP}.${OUTPUT_FORMAT}"
log_debug "Report name: $REPORT_NAME"

log "Starting scan with the following settings:"
echo "  Target URL:  $TARGET_URL"
echo "  Output:      $OUTPUT_FORMAT"
echo "  Max depth:   $MAX_DEPTH"
echo "  Timeout:     $TIMEOUT seconds"
echo "  Report:      $REPORT_NAME"
echo "  Report will be saved to: $ABS_REPORTS_DIR/$REPORT_NAME"

# Build the ZAP command using automation framework.
log_debug "Using ZAP Automation Framework with zap.yaml"

# Check if we want to use performance optimizations.
if [ "${ZAP_PERFORMANCE_MODE:-false}" = "true" ]; then
    log_debug "Using ZAP performance optimizations (ZAP_PERFORMANCE_MODE=true)"
    # Use the -silent flag to disable update checks and other network operations.
    # Use -nostdout to reduce logging overhead.
    ZAP_CMD="zap.sh -cmd -silent -nostdout -autorun /zap/wrk/zap.yaml"
else
    ZAP_CMD="zap.sh -cmd -autorun /zap/wrk/zap.yaml"
fi

# Show a spinner during scanning.
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

# Build the Docker command.
log_debug "Building Docker command"
DOCKER_CMD="docker run --rm \
    -v \"$ABS_ZAP_DIR:/zap/wrk\" \
    -v \"$ABS_REPORTS_DIR:/zap/reports:rw\" \
    -v \"$ABS_TEMP_DIR:/zap/temp:rw\" \
    --platform linux/amd64 \
    --memory=4g \
    --cpus=2 \
    \"$ZAP_IMAGE\" \
    $ZAP_CMD"

log_debug "Docker command: $DOCKER_CMD"

# Pull the ZAP image explicitly first to see if there are any issues.
log "Pulling ZAP Docker image $ZAP_IMAGE..."
if ! docker pull "$ZAP_IMAGE"; then
    log_error "Failed to pull ZAP Docker image. Check your internet connection and Docker configuration."
    exit 1
fi
log_debug "Successfully pulled ZAP image"

# Check if the Docker container can access the internet (for add-on downloads).
log "Checking internet connectivity from Docker..."
if [ "${SKIP_INTERNET_CHECK:-false}" = "true" ]; then
    log_debug "Skipping internet connectivity check (SKIP_INTERNET_CHECK=true)"
else
    START_TIME=$(date +%s)
    if ! docker run --rm "$ZAP_IMAGE" sh -c 'curl -s --max-time 2 https://www.google.com >/dev/null || curl -s --max-time 2 https://cloudflare.com >/dev/null || curl -s --max-time 1 https://github.com >/dev/null'; then
        log_error "Warning: Docker container may not have internet access. This might cause issues with add-on installations."
        log_error "To skip this check, set SKIP_INTERNET_CHECK=true before running."
    else
        END_TIME=$(date +%s)
        DURATION=$((END_TIME - START_TIME))
        log_debug "Docker container has internet connectivity (check took ${DURATION}s)"
    fi
fi

# MARK: Run ZAP Docker

log "Starting ZAP scan..."
log_debug "Setting PYTHONUNBUFFERED=1 to see Python script output in real-time"

# Record start time for ZAP initialization.
START_ZAP_TIME=$(date +%s)

# Run with PYTHONUNBUFFERED to see output in real-time.
CONTAINER_ID=$(docker run -d \
    -e PYTHONUNBUFFERED=1 \
    -v "$ABS_ZAP_DIR:/zap/wrk" \
    -v "$ABS_REPORTS_DIR:/zap/reports:rw" \
    -v "$ABS_TEMP_DIR:/zap/temp:rw" \
    --platform linux/amd64 \
    --memory=4g \
    --cpus=2 \
    "$ZAP_IMAGE" \
    $ZAP_CMD)

log "Docker container started with ID: $CONTAINER_ID"

# Look for ZAP initialization messages with a timeout.
log_debug "Monitoring ZAP initialization (max 60 seconds)..."
INIT_TIMEOUT=60
INIT_START=$(date +%s)
INITIALIZED=false

# Use a timeout to prevent indefinite hanging.
while [ $(($(date +%s) - INIT_START)) -lt $INIT_TIMEOUT ]; do
    # Check for any of several indicators that ZAP is ready.
    if docker logs "$CONTAINER_ID" 2>&1 | grep -q -e "ZAP is now listening" -e "Job spider" -e "Job spiderAjax" -e "ZAP 20"; then
        INITIALIZED=true
        break
    fi
    sleep 2
done

# Calculate ZAP initialization time.
END_ZAP_TIME=$(date +%s)
ZAP_INIT_DURATION=$((END_ZAP_TIME - START_ZAP_TIME))

if [ "$INITIALIZED" = true ]; then
    log "ZAP initialization completed in ${ZAP_INIT_DURATION}s"
else
    log_error "ZAP initialization taking longer than expected (${ZAP_INIT_DURATION}s). Continuing anyway..."
fi

log "Following container logs (press Ctrl+C to stop following but continue scan):"

# Follow logs but don't kill the script if the user hits Ctrl+C.
docker logs -f "$CONTAINER_ID" || true

# Wait for container to finish.
log "Waiting for ZAP scan to complete..."
if ! docker wait "$CONTAINER_ID"; then
    log_error "Docker container exited with an error. Check the logs above for details."
    # Get the exit code
    EXIT_CODE=$(docker inspect "$CONTAINER_ID" --format='{{.State.ExitCode}}')
    log_error "Container exit code: $EXIT_CODE"

    # Print the last few lines of logs.
    log "Last 50 lines of container logs:"
    docker logs --tail 50 "$CONTAINER_ID"

    # Cleanup is still important even if there was an error.
    log "Cleaning up temp directory"
    rm -rf "$TEMP_DIR"

    exit 1
fi

log "Scan completed successfully. Reports saved to $ABS_REPORTS_DIR"

# MARK: Open HTML Report

if [[ "$OUTPUT_FORMAT" == "html" && -f "$ABS_REPORTS_DIR/report_html.html" ]]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        log "Opening report in browser (macOS)"
        open "$ABS_REPORTS_DIR/report_html.html"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        log "Opening report in browser (Linux)"
        xdg-open "$ABS_REPORTS_DIR/report_html.html" &>/dev/null || true
    fi
    log "Report opened in your default browser."
fi

# Clean up temp directory after scan.
log "Cleaning up temp directory"
rm -rf "$TEMP_DIR"

log "Scan process completed"
