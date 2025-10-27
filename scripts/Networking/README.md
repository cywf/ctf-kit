# Networking Scripts

This directory contains network scanning and reconnaissance scripts designed to help you quickly assess network environments during CTF competitions.

## Available Scripts

### 1. basic_nmap_scan.sh

A quick network scanning script to identify live hosts and open ports.

**Usage:**
```bash
./basic_nmap_scan.sh <target>
```

**Examples:**
```bash
# Scan a single host
./basic_nmap_scan.sh 10.10.10.10

# Scan a network range
./basic_nmap_scan.sh 192.168.1.0/24
```

**Features:**
- Version detection (-sV)
- Default script scanning (-sC)
- Fast timing template (-T4)
- Automatic output file generation
- Color-coded output for better readability
- Quick summary of findings

**Output:**
Results are saved in the `scan_results/` directory with timestamps.

**Dependencies:**
- nmap

---

### 2. advanced_nmap_scan.sh

A comprehensive network scanning script using Nmap Scripting Engine (NSE) for in-depth analysis.

**Usage:**
```bash
./advanced_nmap_scan.sh <target> [category]
```

**Examples:**
```bash
# Safe scan (default)
./advanced_nmap_scan.sh 10.10.10.10

# Vulnerability detection
./advanced_nmap_scan.sh 10.10.10.10 vuln

# Service discovery
./advanced_nmap_scan.sh 10.10.10.10 discovery

# Safe exploitation scripts
./advanced_nmap_scan.sh 10.10.10.10 exploit
```

**Script Categories:**
- `vuln`: Vulnerability detection
- `exploit`: Safe exploitation scripts
- `discovery`: Service and host discovery
- `safe`: Only safe scripts (default)
- `default`: Default NSE scripts

**Features:**
- NSE script scanning
- Version detection
- OS detection
- Multiple output formats (text and XML)
- Detailed vulnerability reporting
- Color-coded output

**Output:**
Results are saved in the `scan_results/` directory in both text and XML formats.

**Dependencies:**
- nmap
- nmap scripts (usually included with nmap)

---

## Tips

1. **Start with basic_nmap_scan.sh** for quick reconnaissance
2. **Use advanced_nmap_scan.sh** for detailed analysis once you've identified targets
3. **Review the output files** in `scan_results/` for comprehensive information
4. **Be patient** - advanced scans can take several minutes depending on the target
5. **Use appropriate timing** - adjust -T values if network is unstable

## Ethical Usage

These scripts should only be used in authorized environments:
- CTF competitions
- Bug bounty programs with explicit permission
- Your own networks and systems
- Authorized penetration testing engagements

Unauthorized scanning of networks is illegal and unethical.

## Troubleshooting

**Issue:** "nmap is not installed"
```bash
sudo apt-get update
sudo apt-get install nmap
```

**Issue:** Permission denied
```bash
cd scripts/Networking
chmod +x basic_nmap_scan.sh
chmod +x advanced_nmap_scan.sh
```

**Issue:** Scan results directory not created
- The scripts automatically create the `scan_results/` directory
- Ensure you have write permissions in the current directory
