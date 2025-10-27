# Enumeration Scripts

This directory contains service enumeration scripts designed to extract detailed information from discovered services during CTF competitions.

## Available Scripts

### 1. web_server_enum.sh

Comprehensive web server enumeration script that identifies directories, extracts server information, and fingerprints web applications.

**Usage:**
```bash
./web_server_enum.sh <target_url>
```

**Examples:**
```bash
# Enumerate HTTP server
./web_server_enum.sh http://10.10.10.10

# Enumerate HTTPS server
./web_server_enum.sh https://example.com

# Enumerate with port
./web_server_enum.sh http://10.10.10.10:8080
```

**Features:**
- HTTP header extraction
- Nikto vulnerability scanning
- WhatWeb fingerprinting
- Directory brute-forcing with gobuster
- SSL/TLS certificate information
- Color-coded output

**Tools Used:**
1. **curl**: For HTTP header retrieval
2. **nikto**: Web server vulnerability scanner
3. **whatweb**: Web technology fingerprinting
4. **gobuster**: Directory enumeration
5. **openssl**: SSL/TLS certificate inspection

**Output:**
Results are saved in the `enum_results/` directory with timestamps.

**Dependencies:**
- curl (required)
- nikto (optional)
- whatweb (optional)
- gobuster (optional)
- openssl (optional, for HTTPS)

---

### 2. smb_share_enum.sh

SMB share enumeration script for listing shares and extracting information from SMB services.

**Usage:**
```bash
./smb_share_enum.sh <target_ip> [username] [password]
```

**Examples:**
```bash
# Null session (anonymous)
./smb_share_enum.sh 10.10.10.10

# Guest session
./smb_share_enum.sh 10.10.10.10 guest ""

# Authenticated session
./smb_share_enum.sh 10.10.10.10 admin password123
```

**Features:**
- NetBIOS name resolution
- SMB version detection
- Share enumeration
- Comprehensive enum4linux scan
- SMBMap integration
- RPC user enumeration
- Color-coded output

**Tools Used:**
1. **nmblookup**: NetBIOS name resolution
2. **nmap**: SMB protocol detection
3. **smbclient**: Share listing and access
4. **enum4linux**: Comprehensive SMB enumeration
5. **smbmap**: Share permission mapping
6. **rpcclient**: RPC enumeration

**Output:**
Results are saved in the `enum_results/` directory with timestamps.

**Dependencies:**
- samba-common-bin (nmblookup)
- nmap
- smbclient
- enum4linux (optional)
- smbmap (optional)
- rpcclient (optional)

---

## Installation

### Install all dependencies (Debian/Ubuntu):
```bash
# Basic tools
sudo apt-get update
sudo apt-get install -y curl nmap openssl

# Web enumeration tools
sudo apt-get install -y nikto whatweb gobuster

# SMB enumeration tools
sudo apt-get install -y smbclient enum4linux smbmap samba-common-bin

# Wordlists (for directory enumeration)
sudo apt-get install -y wordlists
```

### Install individual tools:
```bash
# Web tools
sudo apt-get install nikto
sudo apt-get install whatweb
sudo apt-get install gobuster

# SMB tools
sudo apt-get install smbclient
sudo apt-get install enum4linux
sudo apt-get install smbmap
```

## Workflow

### Web Server Enumeration Workflow:
1. Run `web_server_enum.sh` for initial reconnaissance
2. Review the output file for discovered directories and vulnerabilities
3. Use specialized tools for deeper investigation based on findings
4. Access discovered directories in a browser or with curl

### SMB Enumeration Workflow:
1. Run `smb_share_enum.sh` to list shares
2. Review the output for accessible shares
3. Connect to interesting shares using smbclient:
   ```bash
   smbclient //10.10.10.10/ShareName -U username%password
   ```
4. Download and analyze files from shares

## Tips

1. **Start with null/guest sessions** when credentials are unknown
2. **Review full output files** - summaries may miss important details
3. **Use common wordlists** for directory enumeration (already included with gobuster)
4. **Be patient** - enumeration can take several minutes
5. **Take notes** of interesting findings for later exploitation

## Ethical Usage

These scripts should only be used in authorized environments:
- CTF competitions
- Bug bounty programs with explicit permission
- Your own systems and applications
- Authorized penetration testing engagements

Unauthorized enumeration is illegal and unethical.

## Troubleshooting

### Web Enumeration

**Issue:** "curl is not installed"
```bash
sudo apt-get install curl
```

**Issue:** "No wordlist found"
```bash
sudo apt-get install wordlists
# Or specify a custom wordlist path in the script
```

### SMB Enumeration

**Issue:** SMB tools not found
```bash
sudo apt-get install smbclient enum4linux smbmap samba-common-bin
```

**Issue:** Connection timeout
- Check if ports 139/445 are open
- Verify target is running SMB service
- Check firewall rules

**Issue:** Access denied
- Try different authentication methods (null, guest, credentials)
- Check if SMB version is compatible

### General

**Issue:** Permission denied when running scripts
```bash
cd scripts/Enumeration
chmod +x web_server_enum.sh
chmod +x smb_share_enum.sh
```

**Issue:** Output directory not created
- Scripts automatically create the `enum_results/` directory
- Ensure you have write permissions in the current directory
