const express = require('express');
const app = express();
const PORT = 3000;

// Middleware 1: Check username header
function checkUsername(req, res, next) {
  req.username = req.headers['x-username'] || null;
  next();
}

// Middleware 2: Parse JSON
function parseJson(req, res, next) {
  if (req.method !== 'POST') return next();

  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      req.body = JSON.parse(body);
      next();
    } catch (error) {
      res.status(400).send('Error: Invalid JSON');
    }
  });
}

// Middleware 3: Validate array of strings
function validateStringArray(req, res, next) {
  if (req.method !== 'POST') return next();

  if (!Array.isArray(req.body)) {
    return res.status(400).send('Error: Send a JSON array');
  }

  for (const item of req.body) {
    if (typeof item !== 'string') {
      return res.status(400).send('Error: All items must be strings');
    }
  }

  req.subjects = req.body;
  next();
}

// Register middleware
app.use(checkUsername);
app.use(parseJson);
app.use(validateStringArray);

// POST endpoint
app.post('/', (req, res) => {
  const name = req.username
    ? `authenticated as ${req.username}`
    : 'not authenticated';

  const count = req.subjects.length;
  const word = count === 1 ? 'subject' : 'subjects';
  const list = req.subjects.join(', ');

  res.send(
    `You are ${name}.\n\nYou asked about ${count} ${word}: ${list}.`
  );
});

app.listen(PORT, () => {
  console.log(`Custom server started on port ${PORT}`);
});
