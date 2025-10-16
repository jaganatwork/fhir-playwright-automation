#!/usr/bin/env bash
set -euo pipefail

echo "==> Post-create: installing dependencies"

# If package.json exists, install deps (idempotent)
if [ -f "/workspaces/${LOCAL_WORKSPACE_FOLDER_BASENAME:-fhir-playwright-automation}/package.json" ]; then
  cd "/workspaces/${LOCAL_WORKSPACE_FOLDER_BASENAME:-fhir-playwright-automation}"
  npm ci || npm install
fi

# Ensure browsers + OS deps are installed inside the container
npx playwright install --with-deps

echo "==> Post-create complete"
