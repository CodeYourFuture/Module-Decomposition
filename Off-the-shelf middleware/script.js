import express from 'express';
const app = express();

// Built-in middleware to parse JSON bodies
app.use(express.json());

// Middleware 1: Extract username from header or set to null
function usernameMiddleware(req, res, next) {
  const username = req.header('X-Username');
  req.username = username || null;
  next();
}

app.post('/info', usernameMiddleware, function(req, res) {
  // req.body is now automatically parsed by express.json()
  if (
    !Array.isArray(req.body) ||
    !req.body.every(function(item) { return typeof item === 'string'; })
  ) {
    return res.status(400).send('Invalid body: must be JSON array of strings');
  }

  const authMessage = req.username
    ? 'You are authenticated as ' + req.username + '.'
    : 'You are not authenticated.';

  const count = req.body.length;
  const subjects = req.body.join(', ');
  const subjectWord = count === 1 ? 'subject' : 'subjects';
  const subjectMessage = count
    ? 'You have requested information about ' + count + ' ' + subjectWord + ': ' + subjects + '.'
    : 'You have requested information about 0 subjects.';

  res.send(authMessage + '\n\n' + subjectMessage);
});

const PORT = 3000;
app.listen(PORT, function() {
  console.log('Server running on http://localhost:' + PORT);
});
