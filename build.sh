#!/usr/bin/env bash

# Install dependencies
npm install

# Build the project
npm run build

# Serve the built files to preview
npm run preview
cd /workspaces/aoyn1xw.github.io
npm install
npm run build