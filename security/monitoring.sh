#!/bin/bash

# Continuous monitoring script - run with: nohup ./monitoring.sh &

LOG_FILE="/var/log/taxisrilanka-security.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🛡️  Starting security monitoring..."

while true; do
  # Check for connections to malicious IP
  if netstat -tupn | grep -q "5.255.121.141"; then
    log "🚨 ALERT: Connection to malicious IP detected!"
    netstat -tupn | grep "5.255.121.141" >> "$LOG_FILE"
    
    # Kill the process
    PID=$(netstat -tupn | grep "5.255.121.141" | awk '{print $7}' | cut -d'/' -f1)
    if [ ! -z "$PID" ]; then
      log "Killing malicious process: $PID"
      kill -9 "$PID"
    fi
  fi
  
  # Check for high CPU usage (potential mining)
  CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
  if (( $(echo "$CPU_USAGE > 80" | bc -l) )); then
    log "⚠️  WARNING: High CPU usage detected: ${CPU_USAGE}%"
    top -bn1 | head -20 >> "$LOG_FILE"
  fi
  
  # Check for mining processes
  if ps aux | grep -iE "xmrig|xmr|mine|fghgf|stink" | grep -v grep > /dev/null; then
    log "🚨 ALERT: Mining process detected!"
    ps aux | grep -iE "xmrig|xmr|mine|fghgf|stink" | grep -v grep >> "$LOG_FILE"
    pkill -9 -f "xmrig|xmr|mine|fghgf|stink"
  fi
  
  sleep 30  # Check every 30 seconds
done
