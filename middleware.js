const express = require('express');
const app = express();

app.use(express.json());

const userdata = [];
const info = [];

const usernameValidator = (req, res, next) => {
  const username = req.headers['x-username'];
  userdata.push(username);

  const userInfo = `You are authenticated as ${username}`;

  console.log('req.body =', req.body); // debug

  let userMessage = 'No subjects requested';
  if (Array.isArray(req.body) && req.body.length > 0) {
    info.push(...req.body); // push items first
    userMessage = `You have requested information about ${req.body.length} subjects: ${req.body.join(', ')}`;
  }

  console.log(info);

  console.log(`
    ${userInfo}
    ${userMessage}
  `);

  next();
}

app.use(usernameValidator);

app.post('/', (req, res) => {
  const username = req.headers['x-username']; // use lowercase key
  res.send(`Username is ${username}, Subjects: ${JSON.stringify(info)}`);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
})
