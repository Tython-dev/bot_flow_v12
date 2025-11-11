# Docker Deployment Guide for Botpress v12

This guide explains how to deploy your custom Botpress v12 build using Docker on your VPS.

## 🚀 Quick Start

### 1. Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose v2.0+ installed
- At least 4GB RAM available
- 20GB disk space

### 2. Initial Setup

```bash
# Clone your repository
git clone https://github.com/your-repo/bot_flow_v12.git
cd bot_flow_v12

# Copy environment configuration
cp .env.example .env

# Edit .env with your settings
nano .env
```

### 3. Configure Environment Variables

Edit `.env` file:

```env
POSTGRES_PASSWORD=your_secure_password_here
EXTERNAL_URL=https://bot.tybotflow.com
BP_LOG_LEVEL=info
```

### 4. Build and Start Services

```bash
# Build the custom Botpress image
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f botpress
```

### 5. Verify Deployment

```bash
# Check service status
docker-compose ps

# Test Botpress API
curl http://localhost:3000/status

# Check logs for errors
docker-compose logs --tail=100 botpress
```

---

## 📋 Service Architecture

The deployment includes:

1. **Botpress** (Port 3000) - Your custom build
2. **PostgreSQL** (Internal) - Database
3. **Redis** (Internal) - Caching and sessions
4. **Duckling** (Port 8000) - NLU entity extraction

---

## 🔧 Common Commands

### Start/Stop Services

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart Botpress only
docker-compose restart botpress

# Stop and remove all containers + volumes
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Botpress only
docker-compose logs -f botpress

# Last 100 lines
docker-compose logs --tail=100 botpress
```

### Update Botpress

```bash
# Pull latest code
git pull origin botflow_elorchi

# Rebuild and restart
docker-compose build botpress
docker-compose up -d botpress
```

### Database Management

```bash
# Access PostgreSQL
docker-compose exec postgres psql -U botpress -d botpress

# Backup database
docker-compose exec postgres pg_dump -U botpress botpress > backup.sql

# Restore database
docker-compose exec -T postgres psql -U botpress botpress < backup.sql
```

---

## 🔐 Security Recommendations

### 1. Change Default Passwords

```bash
# Generate strong password
openssl rand -base64 32

# Update in .env file
POSTGRES_PASSWORD=generated_password_here
```

### 2. Configure Firewall

```bash
# Allow only necessary ports
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

### 3. Use SSL/TLS

Add Nginx reverse proxy for SSL:

```bash
# Uncomment nginx service in docker-compose.yml
# Configure SSL certificates in deploy/nginx.conf
```

---

## 📊 Performance Tuning

### Increase Database Connections

Edit `docker-compose.yml`:

```yaml
postgres:
  command: postgres -c max_connections=200
```

### Increase Node.js Memory

Edit `docker-compose.yml`:

```yaml
botpress:
  environment:
    NODE_OPTIONS: --max-old-space-size=4096
```

### Enable Redis Persistence

Already configured with AOF (Append Only File).

---

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs botpress

# Check disk space
df -h

# Check Docker resources
docker system df
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Test database connection
docker-compose exec postgres pg_isready -U botpress
```

### Port Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Change port in docker-compose.yml
ports:
  - "3001:3000"
```

### Out of Memory

```bash
# Check container memory usage
docker stats

# Increase Docker memory limit
# Edit /etc/docker/daemon.json
```

---

## 🔄 Backup Strategy

### Automated Backups

Create a backup script:

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Backup database
docker-compose exec -T postgres pg_dump -U botpress botpress | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup botpress data
tar -czf $BACKUP_DIR/data_$DATE.tar.gz ./data

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

Add to crontab:

```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup.sh
```

---

## 📈 Monitoring

### Health Checks

Built-in health checks in docker-compose.yml:

- Botpress: `http://localhost:3000/status`
- PostgreSQL: `pg_isready`
- Redis: `redis-cli ping`
- Duckling: `curl http://localhost:8000`

### Resource Monitoring

```bash
# Real-time stats
docker stats

# Container resource usage
docker-compose top
```

---

## 🌐 Production Deployment with SSL

### Using Let's Encrypt with Nginx

1. Uncomment nginx service in `docker-compose.yml`
2. Configure domain in `deploy/nginx.conf`
3. Obtain SSL certificate:

```bash
# Install certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --webroot -w /var/www/html -d bot.tybotflow.com

# Certificates will be in /etc/letsencrypt/live/
```

4. Update nginx configuration with SSL paths
5. Restart services:

```bash
docker-compose up -d nginx
```

---

## 📞 Support

For issues specific to this deployment:
1. Check logs: `docker-compose logs`
2. Review this guide
3. Check Botpress documentation
4. Review GitHub issues

---

## 🎯 Next Steps

After successful deployment:

1. ✅ Configure your bots in the admin panel
2. ✅ Set up backups (see Backup Strategy above)
3. ✅ Configure monitoring and alerts
4. ✅ Test load capacity with k6
5. ✅ Set up SSL certificates for production
6. ✅ Configure domain and DNS settings

---

**Last Updated**: 2025-11-11
**Botpress Version**: v12 (Custom Build)
