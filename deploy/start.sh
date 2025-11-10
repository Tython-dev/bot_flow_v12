#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR=${PROJECT_DIR:-/opt/botpress}
cd "$PROJECT_DIR"

# Load environment variables from .env if present
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs -d '\n' -I{} echo {}) || true
fi

# Start Botpress (workspace "botpress")
# Uses Yarn script from package.json: "start": "yarn workspace botpress start"
yarn start
