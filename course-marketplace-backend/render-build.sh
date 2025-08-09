#!/usr/bin/env bash
# exit on error
set -o errexit

# Install the dependencies required by Puppeteer
apt-get update && apt-get install -y chromium-browser libgconf-2-4 libatk1.0-0 libatk-bridge2.0-0 libgdk-pixbuf2.0-0 libgtk-3-0 libgbm-dev libnss3-dev libxss1 libasound2

# Install your node modules
npm install