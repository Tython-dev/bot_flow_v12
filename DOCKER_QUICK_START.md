# 🚀 Docker Quick Start Guide

## What's New?

✅ **New Docker Files Created:**
- `Dockerfile.new` - Custom Botpress v12 build (multi-stage)
- `docker-compose.yml` - Complete production stack
- `.env.example` - Environment configuration template
- `deploy/DOCKER_DEPLOYMENT.md` - Full deployment guide
- `deploy/docker-deploy.sh` - Automated deployment script

## 📦 What's Included

Your Docker stack includes:
1. **Botpress** - Your custom build with payload modifications
2. **PostgreSQL** - Database
3. **Redis** - Caching and session storage
4. **Duckling** - NLU entity extraction

## 🎯 Deploy in 3 Steps

### Step 1: Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your settings
nano .env
```

Update these values:
```env
POSTGRES_PASSWORD=your_secure_password
EXTERNAL_URL=https://bot.tybotflow.com
```

### Step 2: Build & Deploy

```bash
# Make deploy script executable
chmod +x deploy/docker-deploy.sh

# Build and start
./deploy/docker-deploy.sh build
./deploy/docker-deploy.sh start
```

### Step 3: Verify

```bash
# Check status
./deploy/docker-deploy.sh status

# View logs
./deploy/docker-deploy.sh logs

# Test API
curl http://localhost:3000/status
```

## 🔄 Common Operations

```bash
# Update deployment (pull latest code)
./deploy/docker-deploy.sh update

# Restart services
./deploy/docker-deploy.sh restart

# Create backup
./deploy/docker-deploy.sh backup

# Stop everything
./deploy/docker-deploy.sh stop
```

## 📚 Full Documentation

See `deploy/DOCKER_DEPLOYMENT.md` for:
- Complete deployment guide
- Security recommendations
- Performance tuning
- Troubleshooting
- Backup strategies
- SSL/HTTPS setup

## ⚠️ Old Docker Files

The following old files are no longer needed:
- `Dockerfile` (root) - Old official Botpress image reference
- `build/docker/Dockerfile` - Old build configuration
- `examples/docker-compose/` - Example configurations

**You can safely delete these after testing the new setup.**

## 🎉 Your Custom Features

This Docker setup includes all your modifications:
- ✅ Unsecured converse endpoint accepts any payload
- ✅ Support for JSON, products, and custom content types
- ✅ Rate limiting disabled for high performance
- ✅ Optimized for VPS deployment

## 🆘 Need Help?

1. Check logs: `./deploy/docker-deploy.sh logs`
2. Check status: `./deploy/docker-deploy.sh status`
3. Read full guide: `deploy/DOCKER_DEPLOYMENT.md`

---

**Ready to deploy?** Run: `./deploy/docker-deploy.sh build && ./deploy/docker-deploy.sh start`
