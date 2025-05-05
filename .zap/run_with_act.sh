#!/bin/bash

# Script to run GitHub Actions locally using act on macOS with M-series chip.

set -e

echo "Running OWASP ZAP GitHub Action locally with act..."

# MARK: Check Act Install

if ! command -v act &>/dev/null; then
    echo "Error: 'act' is not installed."
    echo "Please install it with: brew install act"
    exit 1
fi

# MARK: Docker Checks

# Create a directory for the Docker socket if it doesn't exist.
mkdir -p ~/.docker/run

# Check that Docker is running.
if ! docker info &>/dev/null; then
    echo "Error: Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "Running the ZAP scan job with the appropriate architecture flag for M-series chips..."

# MARK: Run

# Run act with the architecture flag for M-series chips.
act -j zap_scan --container-architecture linux/amd64

echo "Act execution completed."
