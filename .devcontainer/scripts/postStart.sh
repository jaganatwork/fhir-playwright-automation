#!/usr/bin/env bash
set -euo pipefail

# Light, quick tasks (e.g., print versions / sanity checks)
node -v
npm -v
npx playwright --version || true

echo "==> Post-start complete"
