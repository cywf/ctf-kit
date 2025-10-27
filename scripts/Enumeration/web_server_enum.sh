#!/bin/bash

#############################################################################
# Web Server Enumeration Script
#############################################################################
# Purpose: Enumerate web servers, identify directories, and extract information
# Usage: ./web_server_enum.sh <target_url>
# Example: ./web_server_enum.sh http://10.10.10.10
# Example: ./web_server_enum.sh https://example.com
#############################################################################

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if target is provided
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: No target URL specified${NC}"
    echo "Usage: $0 <target_url>"
    echo "Example: $0 http://10.10.10.10"
    echo "Example: $0 https://example.com"
    exit 1
fi

TARGET=$1
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="enum_results"
OUTPUT_FILE="${OUTPUT_DIR}/web_enum_${TIMESTAMP}.txt"

# Extract hostname for file naming
HOSTNAME=$(echo ${TARGET} | sed -e 's|^[^/]*//||' -e 's|[:/].*||')

# Create output directory if it doesn't exist
mkdir -p "${OUTPUT_DIR}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Web Server Enumeration${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Target: ${YELLOW}${TARGET}${NC}"
echo -e "Output: ${YELLOW}${OUTPUT_FILE}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Initialize output file
{
    echo "Web Server Enumeration Report"
    echo "Target: ${TARGET}"
    echo "Date: $(date)"
    echo "=========================================="
    echo ""
} > "${OUTPUT_FILE}"

# Function to check if a tool is installed
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${YELLOW}Warning: $1 is not installed. Skipping $1 checks.${NC}"
        echo "Install with: sudo apt-get install $2"
        return 1
    fi
    return 0
}

# 1. Basic HTTP Headers
echo -e "${YELLOW}[1/5] Fetching HTTP headers...${NC}"
if check_tool "curl" "curl"; then
    {
        echo "=== HTTP Headers ==="
        curl -s -I -L "${TARGET}" | head -30
        echo ""
    } >> "${OUTPUT_FILE}"
fi

# 2. Nikto scan (if available)
echo -e "${YELLOW}[2/5] Running Nikto scan...${NC}"
if check_tool "nikto" "nikto"; then
    {
        echo "=== Nikto Scan Results ==="
        nikto -h "${TARGET}" -maxtime 120s 2>&1 | head -100
        echo ""
    } >> "${OUTPUT_FILE}"
fi

# 3. Whatweb fingerprinting (if available)
echo -e "${YELLOW}[3/5] Running WhatWeb fingerprinting...${NC}"
if check_tool "whatweb" "whatweb"; then
    {
        echo "=== WhatWeb Fingerprinting ==="
        whatweb -v "${TARGET}"
        echo ""
    } >> "${OUTPUT_FILE}"
fi

# 4. Directory bruteforcing with gobuster (if available)
echo -e "${YELLOW}[4/5] Running directory enumeration...${NC}"
if check_tool "gobuster" "gobuster"; then
    # Check for common wordlists
    WORDLIST=""
    if [ -f "/usr/share/wordlists/dirb/common.txt" ]; then
        WORDLIST="/usr/share/wordlists/dirb/common.txt"
    elif [ -f "/usr/share/wordlists/dirbuster/directory-list-2.3-small.txt" ]; then
        WORDLIST="/usr/share/wordlists/dirbuster/directory-list-2.3-small.txt"
    fi
    
    if [ -n "${WORDLIST}" ]; then
        {
            echo "=== Directory Enumeration ==="
            gobuster dir -u "${TARGET}" -w "${WORDLIST}" -t 20 -q 2>&1 | head -50
            echo ""
        } >> "${OUTPUT_FILE}"
    else
        echo -e "${YELLOW}  Warning: No common wordlist found. Skipping directory enumeration.${NC}"
    fi
fi

# 5. SSL/TLS information (for HTTPS)
if [[ ${TARGET} == https://* ]]; then
    echo -e "${YELLOW}[5/5] Checking SSL/TLS information...${NC}"
    if check_tool "openssl" "openssl"; then
        {
            echo "=== SSL/TLS Certificate Information ==="
            echo | openssl s_client -connect ${HOSTNAME}:443 -servername ${HOSTNAME} 2>/dev/null | openssl x509 -noout -text | grep -E "Subject:|Issuer:|Not Before|Not After"
            echo ""
        } >> "${OUTPUT_FILE}"
    fi
else
    echo -e "${YELLOW}[5/5] Skipping SSL check (target is not HTTPS)${NC}"
fi

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Enumeration completed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Results saved to: ${YELLOW}${OUTPUT_FILE}${NC}"
echo ""
echo -e "${YELLOW}Quick Summary:${NC}"

# Display some key findings
if [ -f "${OUTPUT_FILE}" ]; then
    echo -e "${BLUE}---Server Information---${NC}"
    grep -iE "^Server:|^X-Powered-By:" "${OUTPUT_FILE}" | head -5
    echo ""
    echo -e "${BLUE}---Discovered Directories---${NC}"
    grep -E "Status: 200|Status: 301|Status: 302" "${OUTPUT_FILE}" | head -10
fi

echo ""
echo -e "${GREEN}Review the full output file for detailed information${NC}"
