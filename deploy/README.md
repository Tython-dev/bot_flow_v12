# Botpress v12 VPS Deployment (No Docker)

This guide helps you deploy this repo on a Linux VPS using either systemd or PM2. Docker is not used.

## 1) Prerequisites
- Ubuntu 20.04/22.04 (recommended) with sudo
- Git and build tools: `sudo apt update && sudo apt install -y git build-essential curl`
- Node.js 12.x via NVM (recommended) or NodeSource
  - Botpress v12 requires Node 12 (LTS) for this codebase
- Yarn (Classic)
- Nginx (optional, for reverse proxy and TLS)

## 2) Clone and prepare
```bash
# Adjust target directory as needed
sudo mkdir -p /opt/botpress
sudo chown $USER:$USER /opt/botpress
cd /opt/botpress

# Copy your project into /opt/botpress (or git clone your repo here)
# Example if repo is public/private (replace URL):
# git clone https://github.com/your/repo.git .

# If you copied from local machine, upload and extract into /opt/botpress
```

## 3) Configure environment
Copy the example env file and edit values:
```bash
cp deploy/.env.example .env
nano .env
```
Important variables:
- `EXTERNAL_URL` (e.g. `https://your-domain.com`)
- `BP_PORT` (default 3000)
- `BP_PRODUCTION=true`

## 4) Install Node + Yarn and build
```bash
cd /opt/botpress
bash deploy/install.sh
```
This will:
- Install NVM + Node v12.22.12
- Install Yarn
- Install dependencies via `yarn install`
- Build the project via `yarn build`

## 5a) Run with systemd (recommended)
1. Edit the service unit file placeholders (paths and user):
   ```bash
   sudo mkdir -p /etc/systemd/system
   sudo cp deploy/systemd/botpress.service /etc/systemd/system/botpress.service
   sudo nano /etc/systemd/system/botpress.service
   ```
   Update:
   - `User=` to a non-root user that owns `/opt/botpress`
   - `WorkingDirectory=/opt/botpress`
   - `EnvironmentFile=/opt/botpress/.env`

2. Start and enable:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now botpress
   sudo systemctl status botpress
   ```

3. Logs:
   ```bash
   journalctl -u botpress -f
   ```

## 5b) Run with PM2 (alternative)
```bash
cd /opt/botpress
npm i -g pm2
pm2 start deploy/ecosystem.config.js
pm2 save
pm2 startup  # follow instructions to enable at boot
pm2 logs botpress
```

## 6) Nginx reverse proxy (optional)
- Copy `deploy/nginx.conf.sample` to your Nginx sites-available and enable it.
- Adjust `server_name` and upstream port.
- Reload Nginx.

```bash
sudo cp deploy/nginx.conf.sample /etc/nginx/sites-available/botpress.conf
sudo ln -s /etc/nginx/sites-available/botpress.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 7) Update flow
- Pull new code or upload changes
- `yarn install && yarn build`
- Restart systemd: `sudo systemctl restart botpress` (or `pm2 restart botpress`)

## Notes
- This repo is a monorepo using Yarn workspaces. To start the server in production, we use `yarn start` which runs the Botpress workspace.
- Ensure the `.env` file exists at the project root and contains valid values. Botpress reads environment variables like `EXTERNAL_URL` and `BP_PORT`.
