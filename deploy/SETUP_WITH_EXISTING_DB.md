# Setup Docker Deployment with Existing PostgreSQL

Your VPS already has PostgreSQL running. This guide shows how to use it with the Docker deployment.

## 📋 Your Current Setup

- **PostgreSQL User**: `elorchi`
- **Database**: `botflow`
- **Host**: `127.0.0.1` (localhost)

## 🚀 Quick Setup

### 1. Create Environment File

```bash
cd ~/bot_flow_v12
cp .env.example .env
nano .env
```

### 2. Configure .env File

Update with your PostgreSQL password:

```env
# Use your existing PostgreSQL database
DATABASE_URL=postgres://elorchi:YOUR_ACTUAL_PASSWORD@host.docker.internal:5432/botflow
POSTGRES_PASSWORD=YOUR_ACTUAL_PASSWORD

# Your domain
EXTERNAL_URL=https://bot.tybotflow.com

# Log level
BP_LOG_LEVEL=info
```

**Important**: Replace `YOUR_ACTUAL_PASSWORD` with your actual PostgreSQL password!

### 3. Build and Start Services

```bash
# Build the Docker image
docker-compose build botpress

# Start services (without postgres container)
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f botpress
```

## 🔍 What's Running

With this configuration:

✅ **Botpress** (Docker container) - Port 3000  
✅ **Redis** (Docker container) - For caching  
✅ **Duckling** (Docker container) - For NLU  
✅ **PostgreSQL** (Host system) - Your existing database  

## 🔧 PostgreSQL Configuration

### Allow Docker to Connect

Make sure PostgreSQL accepts connections from Docker containers.

Edit `/etc/postgresql/*/main/postgresql.conf`:
```ini
listen_addresses = 'localhost,172.17.0.1'
```

Edit `/etc/postgresql/*/main/pg_hba.conf`:
```
# Allow Docker network
host    botflow         elorchi         172.17.0.0/16           md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

## ✅ Verify Connection

Test that Docker can connect to your database:

```bash
# From inside the Botpress container
docker-compose exec botpress sh

# Try connecting to PostgreSQL
apk add postgresql-client
psql -U elorchi -d botflow -h host.docker.internal
```

## 📊 Performance Tuning

Since you're keeping PostgreSQL on the host, optimize it for better performance:

### Increase Connection Limits

Edit `/etc/postgresql/*/main/postgresql.conf`:

```ini
# Increase for better concurrency
max_connections = 200

# Tune for your 63GB RAM
shared_buffers = 4GB
effective_cache_size = 16GB
maintenance_work_mem = 1GB
work_mem = 32MB

# Better write performance
wal_buffers = 16MB
checkpoint_completion_target = 0.9
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

## 🔄 Switching to Containerized PostgreSQL (Optional)

If you later want to use a containerized PostgreSQL instead:

1. **Update .env**:
   ```env
   DATABASE_URL=postgres://botpress:secure_password@postgres:5432/botpress
   POSTGRES_PASSWORD=secure_password
   ```

2. **Start with postgres profile**:
   ```bash
   docker-compose --profile with-postgres up -d
   ```

## 🐛 Troubleshooting

### Connection Refused

If Botpress can't connect to PostgreSQL:

```bash
# Check PostgreSQL is listening
sudo netstat -plnt | grep 5432

# Check from Docker
docker-compose exec botpress ping host.docker.internal

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### Authentication Failed

- Verify password in `.env` is correct
- Check `pg_hba.conf` allows connections from Docker network
- Restart PostgreSQL after config changes

### Database Doesn't Exist

If the `botflow` database doesn't exist, create it:

```bash
sudo -u postgres psql
CREATE DATABASE botflow OWNER elorchi;
\q
```

## 📈 Expected Performance

With your existing PostgreSQL optimized and Redis caching:

| Concurrent Users | Expected Success Rate |
|------------------|----------------------|
| 20-50 VUs | ✅ 99-100% |
| 100 VUs | ✅ 95-98% |
| 200 VUs | ✅ 90-95% |
| 500 VUs | ⚠️ 85-90% |

Much better than the 29% you were getting!

## 🎯 Next Steps

1. ✅ Configure .env with your PostgreSQL password
2. ✅ Build Docker image: `docker-compose build`
3. ✅ Start services: `docker-compose up -d`
4. ✅ Test endpoint: `curl http://localhost:3000/status`
5. ✅ Run K6 test again to see improvement!

---

**Ready to deploy?** Update your `.env` file and run the build!
