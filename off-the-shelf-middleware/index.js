// Middleware 1 - custom middleware - looks for a header with name "X-Username"
function usernameMiddleware(request, response, next) {
  const usernameHeader = request.header("X-Username");
  request.username = usernameHeader ? usernameHeader : null;
  next();
}

const express = require("express");
const app = express();
const PORT = 3000;

app.use(usernameMiddleware);
app.use(express.json()); // Add the built-in JSON parser middleware


app.post("/", (request, response) => {
  let responseToClient;
  if (request.username) {
    responseToClient = `You are authenticated as ${request.username}.`;
  } else {
    responseToClient = "You are not authenticated.";
  }

  response.send(`${responseToClient}`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
