#!/usr/bin/env bash
set -euo pipefail

# This script installs Node 12 (via NVM), Yarn, project deps and builds Botpress v12

PROJECT_DIR=${PROJECT_DIR:-/opt/botpress}
NODE_VERSION=${NODE_VERSION:-12.22.12}

# Ensure running under project dir
cd "$PROJECT_DIR"

# Install NVM if missing
if [ ! -d "$HOME/.nvm" ]; then
  echo "Installing NVM..."
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi

# Load NVM
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Install Node 12
nvm install "$NODE_VERSION"
nvm use "$NODE_VERSION"
node -v

# Install Yarn classic if missing
if ! command -v yarn >/dev/null 2>&1; then
  echo "Installing Yarn..."
  npm i -g yarn
fi

echo "Installing dependencies..."
yarn install --frozen-lockfile || yarn install

echo "Building project..."
yarn build

echo "Done. You can now run with systemd or PM2."
