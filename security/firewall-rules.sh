#!/bin/bash

set -e

echo "🛡️  CONFIGURING FIREWALL PROTECTION"
echo "===================================="

# Flush existing rules
iptables -F
iptables -X
iptables -Z

# Default policies
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Allow established connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Allow SSH (change port if needed)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# === BLOCK MALICIOUS IPS ===
# Block specific mining pool IP
iptables -A OUTPUT -d 5.255.121.141 -j DROP
iptables -A FORWARD -d 5.255.121.141 -j DROP

# Block entire subnet
iptables -A OUTPUT -d 5.255.121.0/24 -j DROP

# Block AS60404 (The Infrastructure Group B.V.)
iptables -A OUTPUT -d 5.255.0.0/16 -j DROP

# Block common mining pool ports
iptables -A OUTPUT -p tcp --dport 3333 -j DROP  # Stratum
iptables -A OUTPUT -p tcp --dport 4444 -j DROP  # XMRig
iptables -A OUTPUT -p tcp --dport 5555 -j DROP  # Mining
iptables -A OUTPUT -p tcp --dport 7777 -j DROP  # Mining
iptables -A OUTPUT -p tcp --dport 14444 -j DROP # Monero

# Block Russian IP ranges (optional - only if not serving Russian users)
# iptables -A OUTPUT -d 185.0.0.0/8 -j DROP
# iptables -A OUTPUT -d 195.0.0.0/8 -j DROP

# Log dropped packets
iptables -A INPUT -j LOG --log-prefix "DROPPED INPUT: "
iptables -A OUTPUT -j LOG --log-prefix "DROPPED OUTPUT: "

# Save rules
iptables-save > /etc/iptables/rules.v4
netfilter-persistent save

echo "✅ Firewall rules applied successfully"
