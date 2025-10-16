# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------
# 🧱 Base image: Node + TypeScript optimized for Codespaces
# ---------------------------------------------------------------------
FROM mcr.microsoft.com/devcontainers/typescript-node:20

# ---------------------------------------------------------------------
# 🧩 Install GUI and media libraries for Playwright headed mode
# ---------------------------------------------------------------------
USER root
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends \
       xvfb \
       libnss3 \
       libatk-bridge2.0-0 \
       libxkbcommon0 \
       libgtk-3-0 \
       libgbm1 \
       libxshmfence1 \
       libasound2 \
    && rm -rf /var/lib/apt/lists/*

# ---------------------------------------------------------------------
# 🧩 Optional utilities & fonts (useful for debugging, reports, etc.)
# ---------------------------------------------------------------------
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends \
       git openssh-client less unzip zip jq curl ca-certificates \
       fonts-liberation libfontconfig1 \
    && rm -rf /var/lib/apt/lists/*

# ---------------------------------------------------------------------
# ⚙️ Add convenience alias for headed test execution
# ---------------------------------------------------------------------
RUN echo "alias pw-head='xvfb-run npx playwright test --headed'" >> /home/node/.bashrc

# ---------------------------------------------------------------------
# 🗂️ Cache directory for Playwright browsers
# ---------------------------------------------------------------------
RUN mkdir -p /ms-playwright && chown -R node:node /ms-playwright

# ---------------------------------------------------------------------
# 👤 Switch to non-root user (best practice for security)
# ---------------------------------------------------------------------
USER node

# ---------------------------------------------------------------------
# 📁 Default working directory inside Codespace
# ---------------------------------------------------------------------
WORKDIR /workspaces/fhir-playwright-automation
