#!/bin/bash

#############################################################################
# Advanced Nmap Scan with NSE
#############################################################################
# Purpose: Perform comprehensive network scanning using Nmap Scripting Engine
# Usage: ./advanced_nmap_scan.sh <target> [category]
# Example: ./advanced_nmap_scan.sh 192.168.1.10 vuln
# Categories: vuln, exploit, discovery, safe, default
#############################################################################

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if target is provided
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: No target specified${NC}"
    echo "Usage: $0 <target> [category]"
    echo "Example: $0 192.168.1.10 vuln"
    echo ""
    echo "Available script categories:"
    echo "  - vuln: Vulnerability detection"
    echo "  - exploit: Safe exploitation scripts"
    echo "  - discovery: Service and host discovery"
    echo "  - safe: Only safe scripts (default)"
    echo "  - default: Default NSE scripts"
    exit 1
fi

TARGET=$1
CATEGORY=${2:-safe}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="scan_results"
OUTPUT_FILE="${OUTPUT_DIR}/advanced_scan_${CATEGORY}_${TIMESTAMP}"

# Check if nmap is installed
if ! command -v nmap &> /dev/null; then
    echo -e "${RED}Error: nmap is not installed${NC}"
    echo "Install with: sudo apt-get install nmap"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "${OUTPUT_DIR}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Advanced Nmap Scan with NSE${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Target:   ${YELLOW}${TARGET}${NC}"
echo -e "Category: ${YELLOW}${CATEGORY}${NC}"
echo -e "Output:   ${YELLOW}${OUTPUT_FILE}.{txt,xml}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Build nmap command based on category
case ${CATEGORY} in
    vuln)
        echo -e "${YELLOW}Running vulnerability detection scripts...${NC}"
        SCRIPT_ARGS="--script=vuln"
        ;;
    exploit)
        echo -e "${YELLOW}Running safe exploitation scripts...${NC}"
        SCRIPT_ARGS="--script=exploit and not dos"
        ;;
    discovery)
        echo -e "${YELLOW}Running discovery scripts...${NC}"
        SCRIPT_ARGS="--script=discovery"
        ;;
    default)
        echo -e "${YELLOW}Running default NSE scripts...${NC}"
        SCRIPT_ARGS="--script=default"
        ;;
    safe|*)
        echo -e "${YELLOW}Running safe scripts...${NC}"
        SCRIPT_ARGS="--script=safe"
        ;;
esac

# Perform advanced scan
# -sV: Version detection
# -sC: Script scan based on category
# -A: Enable OS detection, version detection, script scanning
# -T4: Timing template (faster)
# -oN: Normal output format
# -oX: XML output format
echo -e "${BLUE}This may take several minutes depending on the target...${NC}"
echo ""

nmap -sV ${SCRIPT_ARGS} -A -T4 -oN "${OUTPUT_FILE}.txt" -oX "${OUTPUT_FILE}.xml" "${TARGET}"

# Check if scan was successful
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Scan completed successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "Results saved to:"
    echo -e "  - Normal output: ${YELLOW}${OUTPUT_FILE}.txt${NC}"
    echo -e "  - XML output:    ${YELLOW}${OUTPUT_FILE}.xml${NC}"
    echo ""
    
    # Show interesting findings
    echo -e "${YELLOW}Interesting Findings:${NC}"
    echo -e "${BLUE}---Open Ports---${NC}"
    grep -E "^[0-9]+/tcp.*open" "${OUTPUT_FILE}.txt" | head -20
    echo ""
    
    if [ "${CATEGORY}" = "vuln" ]; then
        echo -e "${BLUE}---Potential Vulnerabilities---${NC}"
        grep -iE "VULNERABLE|CVE-" "${OUTPUT_FILE}.txt" | head -10
    fi
else
    echo -e "${RED}Error: Scan failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Tip: Review the full output file for detailed information${NC}"
