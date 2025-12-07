# taxisrilanka Deployment Guide

## Prerequisites

1. DigitalOcean Droplet (Ubuntu 22.04 LTS recommended)
2. Domain name: taxisrilanka.com
3. SSH access to the server

## Phase 1: HTTP Deployment (No SSL)

### Step 1: Set up DigitalOcean Droplet

1. Create a new Droplet on DigitalOcean:
   - Choose Ubuntu 22.04 LTS
   - Select at least 2GB RAM (Basic plan: $12/month)
   - Choose a datacenter region close to your users
   - Add SSH keys for authentication

2. Point your domain to the droplet:
   - Add an A record: `taxisrilanka.com` → Your Droplet IP
   - Add an A record: `www.taxisrilanka.com` → Your Droplet IP

### Step 2: Connect to Your Droplet

```bash
ssh root@your_droplet_ip
```

### Step 3: Install Docker and Docker Compose

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Verify installations
docker --version
docker-compose --version
```

### Step 4: Install Git

```bash
apt install git -y
```

### Step 5: Clone Your Repository

```bash
cd /var/www
git clone https://github.com/yourusername/taxisrilanka.git
cd taxisrilanka
```

### Step 6: Deploy the Application

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Step 7: Verify Deployment

```bash
# Check running containers
docker ps

# Check logs
docker-compose logs -f taxisrilanka
```

Visit `http://taxisrilanka.com` in your browser.

## Phase 2: HTTPS Deployment (With SSL)

### Step 1: Stop HTTP Deployment

```bash
docker-compose down
```

### Step 2: Update Email in SSL Script

Edit `init-letsencrypt.sh` and replace `your-email@example.com` with your actual email.

### Step 3: Make SSL Script Executable

```bash
chmod +x init-letsencrypt.sh
```

### Step 4: Initialize SSL Certificates

```bash
./init-letsencrypt.sh
```

This script will:
- Download recommended TLS parameters
- Create dummy certificates
- Request real certificates from Let's Encrypt
- Configure Nginx with SSL

### Step 5: Start Services with SSL

```bash
docker-compose -f docker-compose.ssl.yml up -d
```

### Step 6: Verify HTTPS

Visit `https://taxisrilanka.com` in your browser. The site should load with a valid SSL certificate.

### Step 7: Set Up Auto-Renewal

The certbot container automatically renews certificates every 12 hours. Verify it's running:

```bash
docker ps | grep certbot
```

## Maintenance Commands

### View Logs

```bash
# All services
docker-compose -f docker-compose.ssl.yml logs -f

# Specific service
docker-compose -f docker-compose.ssl.yml logs -f taxisrilanka
docker-compose -f docker-compose.ssl.yml logs -f nginx
```

### Restart Services

```bash
docker-compose -f docker-compose.ssl.yml restart
```

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose -f docker-compose.ssl.yml up -d --build
```

### Stop Services

```bash
docker-compose -f docker-compose.ssl.yml down
```

### Manual Certificate Renewal (if needed)

```bash
docker-compose -f docker-compose.ssl.yml run --rm certbot renew
docker-compose -f docker-compose.ssl.yml exec nginx nginx -s reload
```

## Firewall Configuration

```bash
# Install UFW
apt install ufw -y

# Allow SSH
ufw allow OpenSSH

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

## Monitoring

### Check System Resources

```bash
# CPU and Memory usage
docker stats

# Disk usage
df -h
```

### Check SSL Certificate Expiry

```bash
docker-compose -f docker-compose.ssl.yml run --rm certbot certificates
```

## Troubleshooting

### Application Not Starting

```bash
# Check logs
docker-compose -f docker-compose.ssl.yml logs taxisrilanka

# Rebuild
docker-compose -f docker-compose.ssl.yml up -d --build --force-recreate
```

### SSL Certificate Issues

```bash
# Test with staging first
# Edit init-letsencrypt.sh and set staging=1

# Remove existing certificates
rm -rf ./certbot

# Run initialization again
./init-letsencrypt.sh
```

### Nginx Configuration Issues

```bash
# Test nginx configuration
docker-compose -f docker-compose.ssl.yml exec nginx nginx -t

# Reload nginx
docker-compose -f docker-compose.ssl.yml exec nginx nginx -s reload
```

## Backup Strategy

### Backup SSL Certificates

```bash
tar -czf certbot-backup-$(date +%Y%m%d).tar.gz ./certbot
```

### Backup Application Data

```bash
tar -czf app-backup-$(date +%Y%m%d).tar.gz /var/www/taxisrilanka
```

## Security Recommendations

1. Change default SSH port
2. Set up fail2ban for intrusion prevention
3. Enable automatic security updates
4. Use strong passwords and SSH keys only
5. Regularly update Docker images and system packages

## Performance Optimization

1. Enable caching in Nginx
2. Use CDN for static assets
3. Monitor application performance with tools like PM2 or New Relic
4. Set up database connection pooling if using a database
5. Implement rate limiting in Nginx

## Estimated Costs (DigitalOcean)

- Basic Droplet (2GB RAM): $12/month
- Backups (optional): +20% ($2.40/month)
- Total: ~$15/month

## Support

For issues, check:
- Application logs: `docker-compose -f docker-compose.ssl.yml logs`
- Nginx logs: `docker-compose -f docker-compose.ssl.yml logs nginx`
- System logs: `journalctl -xe`
