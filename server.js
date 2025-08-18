const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files
app.use(express.static(__dirname));

// Clean URL handling - serve .html files for clean URLs
app.get('/merch', (req, res) => {
  res.sendFile(path.join(__dirname, 'merch.html'));
});

app.get('/biography', (req, res) => {
  res.sendFile(path.join(__dirname, 'biography-retro.html'));
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Redirect .html to clean URLs
app.get('/merch.html', (req, res) => {
  res.redirect(301, '/merch');
});

app.get('/biography-retro.html', (req, res) => {
  res.redirect(301, '/biography');
});

app.get('/index.html', (req, res) => {
  res.redirect(301, '/');
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log('✅ Clean URLs enabled:');
  console.log(`   - http://localhost:${port}/`);
  console.log(`   - http://localhost:${port}/merch`);
  console.log(`   - http://localhost:${port}/biography`);
});