#!/usr/bin/env bash
set -euo pipefail

echo "==> Post-start sanity checks"

echo "Node version:"
node -v

echo "NPM version:"
npm -v

# Playwright version check (non-interactive)
if command -v playwright &> /dev/null; then
  playwright --version
else
  echo "Playwright not globally installed, using npx fallback"
  npx --yes playwright --version || true
fi

echo "==> Post-start complete"

