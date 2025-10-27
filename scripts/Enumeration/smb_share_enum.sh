#!/bin/bash

#############################################################################
# SMB Share Enumeration Script
#############################################################################
# Purpose: Enumerate SMB shares and extract information from SMB services
# Usage: ./smb_share_enum.sh <target_ip> [username] [password]
# Example: ./smb_share_enum.sh 10.10.10.10
# Example: ./smb_share_enum.sh 10.10.10.10 guest ""
# Example: ./smb_share_enum.sh 10.10.10.10 admin password123
#############################################################################

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if target is provided
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: No target IP specified${NC}"
    echo "Usage: $0 <target_ip> [username] [password]"
    echo "Example: $0 10.10.10.10"
    echo "Example: $0 10.10.10.10 guest \"\""
    echo "Example: $0 10.10.10.10 admin password123"
    exit 1
fi

TARGET=$1
USERNAME=${2:-""}
PASSWORD=${3:-""}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="enum_results"
OUTPUT_FILE="${OUTPUT_DIR}/smb_enum_${TARGET}_${TIMESTAMP}.txt"

# Create output directory if it doesn't exist
mkdir -p "${OUTPUT_DIR}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}SMB Share Enumeration${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Target:   ${YELLOW}${TARGET}${NC}"
if [ -n "${USERNAME}" ]; then
    echo -e "Username: ${YELLOW}${USERNAME}${NC}"
fi
echo -e "Output:   ${YELLOW}${OUTPUT_FILE}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Initialize output file
{
    echo "SMB Share Enumeration Report"
    echo "Target: ${TARGET}"
    echo "Username: ${USERNAME:-'NULL/Guest Session'}"
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

# Build authentication parameters
AUTH_PARAMS=""
if [ -n "${USERNAME}" ]; then
    AUTH_PARAMS="-U ${USERNAME}"
    if [ -n "${PASSWORD}" ]; then
        AUTH_PARAMS="${AUTH_PARAMS}%${PASSWORD}"
    else
        AUTH_PARAMS="${AUTH_PARAMS}%"
    fi
else
    AUTH_PARAMS="-N"  # Null session
fi

# 1. NetBIOS name resolution
echo -e "${YELLOW}[1/6] Performing NetBIOS name resolution...${NC}"
if check_tool "nmblookup" "samba-common-bin"; then
    {
        echo "=== NetBIOS Information ==="
        nmblookup -A "${TARGET}" 2>/dev/null
        echo ""
    } >> "${OUTPUT_FILE}"
fi

# 2. SMB version detection with nmap
echo -e "${YELLOW}[2/6] Detecting SMB version...${NC}"
if check_tool "nmap" "nmap"; then
    {
        echo "=== SMB Version Detection ==="
        nmap -p 139,445 --script smb-protocols,smb-security-mode "${TARGET}" 2>/dev/null
        echo ""
    } >> "${OUTPUT_FILE}"
fi

# 3. List shares with smbclient
echo -e "${YELLOW}[3/6] Listing available shares...${NC}"
if check_tool "smbclient" "smbclient"; then
    {
        echo "=== Available Shares ==="
        smbclient -L "//${TARGET}" ${AUTH_PARAMS} 2>/dev/null
        echo ""
    } >> "${OUTPUT_FILE}"
fi

# 4. Enum4linux comprehensive scan
echo -e "${YELLOW}[4/6] Running enum4linux...${NC}"
if check_tool "enum4linux" "enum4linux"; then
    {
        echo "=== Enum4linux Results ==="
        if [ -n "${USERNAME}" ]; then
            enum4linux -a -u "${USERNAME}" -p "${PASSWORD}" "${TARGET}" 2>/dev/null | head -200
        else
            enum4linux -a "${TARGET}" 2>/dev/null | head -200
        fi
        echo ""
    } >> "${OUTPUT_FILE}"
fi

# 5. SMB enumeration with smbmap
echo -e "${YELLOW}[5/6] Running smbmap...${NC}"
if check_tool "smbmap" "smbmap"; then
    {
        echo "=== SMBMap Results ==="
        if [ -n "${USERNAME}" ]; then
            smbmap -H "${TARGET}" -u "${USERNAME}" -p "${PASSWORD}" 2>/dev/null
        else
            smbmap -H "${TARGET}" 2>/dev/null
        fi
        echo ""
    } >> "${OUTPUT_FILE}"
fi

# 6. RPC enumeration
echo -e "${YELLOW}[6/6] Enumerating RPC...${NC}"
if check_tool "rpcclient" "rpcclient"; then
    {
        echo "=== RPC User Enumeration ==="
        if [ -n "${USERNAME}" ]; then
            echo "enumdomusers" | rpcclient -U "${USERNAME}%${PASSWORD}" "${TARGET}" 2>/dev/null | head -20
        else
            echo "enumdomusers" | rpcclient -U "" -N "${TARGET}" 2>/dev/null | head -20
        fi
        echo ""
    } >> "${OUTPUT_FILE}"
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
    echo -e "${BLUE}---NetBIOS Names---${NC}"
    grep -E "<[0-9A-F]{2}>" "${OUTPUT_FILE}" | head -5
    echo ""
    echo -e "${BLUE}---Available Shares---${NC}"
    grep -E "Disk|IPC" "${OUTPUT_FILE}" | grep -v "Reconnecting" | head -10
    echo ""
    echo -e "${BLUE}---Domain/Workgroup---${NC}"
    grep -iE "Domain=|Workgroup=" "${OUTPUT_FILE}" | head -3
fi

echo ""
echo -e "${GREEN}Review the full output file for detailed information${NC}"
echo -e "${YELLOW}Tip: Try accessing shares with: smbclient //${TARGET}/SHARENAME ${AUTH_PARAMS}${NC}"
