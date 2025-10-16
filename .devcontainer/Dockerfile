# syntax=docker/dockerfile:1

# Good, stable base for Node + TS dev in Codespaces
FROM mcr.microsoft.com/devcontainers/typescript-node:20

# Install OS packages commonly needed by Playwright and tooling
# Note: Many Playwright deps are installed by `npx playwright install --with-deps` during postCreate
USER root
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends \
       git openssh-client less unzip zip jq ca-certificates curl \
       # fonts are helpful for headless browser rendering
       fonts-liberation libfontconfig1 \
    && rm -rf /var/lib/apt/lists/*

# Create a place to cache Playwright browsers to speed up rebuilds
RUN mkdir -p /ms-playwright && chown -R node:node /ms-playwright

# Switch back to the non-root user provided by the base image
USER node

# Set working directory (Codespaces will still mount your repo at /workspaces/<repo>)
WORKDIR /workspaces/fhir-playwright-automation
