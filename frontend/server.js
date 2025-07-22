const express = require('express');
const { join } = require('path');
const { createServer } = require('http');
const { parse } = require('url');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the dist/frontend directory
app.use(express.static(join(__dirname, 'dist/frontend')));

// Handle Angular routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist/frontend/index.html'));
});

// Start the server
const server = createServer(app);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
