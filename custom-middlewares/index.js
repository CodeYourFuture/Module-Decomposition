// Middleware 1 looks for a header with name "X-Username"
function usernameMiddleware(request, response, next) {
  const usernameHeader = request.header("X-Username");
  request.username = usernameHeader ? usernameHeader : null;
  next();
}

// Middleware 2 parse the POST body as JSON array
function postBodyAsJsonMiddleware(request, response, next) {
  let data = '';

  request.on('data', chunk => {
    data += chunk;
  });

  request.on('end', () => {
    try {
      const parsedData = JSON.parse(data);

      if (!Array.isArray(parsedData) || !parsedData.every(item => typeof item === 'string')) {
        return response.status(400).send('Invalid request: must be a JSON array of strings')
      }

      request.body = parsedData;
      next();
    } catch (err) {
      response.status(400).send("Invalid JSON");
    }
  });
}



const express = require("express");

const app = express();
const PORT = 3000;

app.use(usernameMiddleware);


app.post("/", (request, response) => {
  if (request.username) {
    response.send(`You are authenticated as ${request.username}.`);
  } else {
    response.send("You are not authenticated.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

