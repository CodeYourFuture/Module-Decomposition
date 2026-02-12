// Middleware 1 looks for a header with name "X-Username"
function usernameMiddleware(request, response, next) {
  const usernameHeader = request.header("X-Username");
  request.username = usernameHeader ? usernameHeader : null;
  next();
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

