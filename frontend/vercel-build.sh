#!/bin/bash
# Exit on error
set -e

# Install dependencies with legacy peer deps
npm install --legacy-peer-deps

# Build the Angular app
npm run build

# Create a simple server.js for Vercel
echo 'const express = require("express");
const { join } = require("path");
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const app = next({ dev: false });
const handle = app.getRequestHandler();
const server = express();

server.use(express.static(join(__dirname, "dist/frontend")));

server.get("*", (req, res) => {
  return handle(req, res);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});' > server.js

# Make the script executable
chmod +x vercel-build.sh
