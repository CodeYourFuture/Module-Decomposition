const express = require("express");
const app = express();

// 🧱 Middleware 1: Check for X-Username header (same as before)
function usernameMiddleware(req, res, next) {
  const username = req.header("X-Username");
  req.username = username ? username : null;
  next();
}

// ✅ Use built-in Express middleware to parse JSON
// This automatically parses JSON bodies if Content-Type is application/json
// You don’t need to collect chunks manually anymore!

app.post("/", usernameMiddleware, express.json(), (req, res) => {
  const username = req.username;
  const subjects = req.body;

  // Validate that body is an array of strings
  if (!Array.isArray(subjects)) {
    return res.status(400).send("Request body must be a JSON array.");
  }

  const allStrings = subjects.every((item) => typeof item === "string");
  if (!allStrings) {
    return res.status(400).send("All array elements must be strings.");
  }

  const count = subjects.length;
  let response = "";

  if (username) {
    response += `You are authenticated as ${username}.\n\n`;
  } else {
    response += "You are not authenticated.\n\n";
  }

  if (count === 1) {
    response += `You have requested information about 1 subject: ${subjects[0]}.`;
  } else if (count > 1) {
    response += `You have requested information about ${count} subjects: ${subjects.join(
      ", "
    )}.`;
  } else {
    response += "You have requested information about 0 subjects.";
  }

  res.send(response);
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
//   curl -X POST \
//   --data '["Bees"]' \
//   -H "Content-Type: application/json" \
//   -H "X-Username: Ahmed" \
//   http://localhost:3000
