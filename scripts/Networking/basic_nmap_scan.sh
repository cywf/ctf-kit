#!/bin/bash

#############################################################################
# Basic Nmap Scan Script
#############################################################################
# Purpose: Quickly scan a network to identify live hosts and open ports
# Usage: ./basic_nmap_scan.sh <target>
# Example: ./basic_nmap_scan.sh 192.168.1.0/24
#############################################################################

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if target is provided
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: No target specified${NC}"
    echo "Usage: $0 <target>"
    echo "Example: $0 192.168.1.0/24"
    echo "Example: $0 10.10.10.10"
    exit 1
fi

TARGET=$1
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="scan_results"
OUTPUT_FILE="${OUTPUT_DIR}/basic_scan_${TIMESTAMP}.txt"

# Check if nmap is installed
if ! command -v nmap &> /dev/null; then
    echo -e "${RED}Error: nmap is not installed${NC}"
    echo "Install with: sudo apt-get install nmap"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "${OUTPUT_DIR}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Starting Basic Nmap Scan${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Target: ${YELLOW}${TARGET}${NC}"
echo -e "Output: ${YELLOW}${OUTPUT_FILE}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Perform basic scan
# -sV: Version detection
# -sC: Default script scan
# -T4: Timing template (faster)
# -oN: Normal output format
echo -e "${YELLOW}Running scan...${NC}"
nmap -sV -sC -T4 -oN "${OUTPUT_FILE}" "${TARGET}"

# Check if scan was successful
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Scan completed successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "Results saved to: ${YELLOW}${OUTPUT_FILE}${NC}"
    echo ""
    echo -e "${YELLOW}Quick Summary:${NC}"
    grep -E "Nmap scan report|open" "${OUTPUT_FILE}" | head -20
else
    echo -e "${RED}Error: Scan failed${NC}"
    exit 1
fi
