#!/bin/bash
set -e

echo "=== Starting build process ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo "\n=== Installing dependencies ==="
npm install

echo "\n=== Building the application ==="
npm run build

# Verify build output
echo "\n=== Verifying build output ==="
if [ ! -f "dist/app.js" ]; then
    echo "ERROR: dist/app.js was not created during build!"
    echo "Current directory contents:"
    ls -la
    echo "\ndist/ contents:"
    ls -la dist/ || echo "dist/ directory does not exist"
    exit 1
fi

echo "\n=== Build completed successfully! ==="
echo "Build output in dist/:"
ls -la dist/
