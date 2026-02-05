//create the app using express
const express = require("express");
const app = express();
//my first middleware , request/get the header and attach it to req
function userNameMiddleware(req, res, next) {
  const username = req.header("X-Username");  
  req.username = username ? username : null;
  next(); //to pass control onward
}
// middleware 1: parse raw JSON into req.body
function parseJsonMiddleware(req, res, next) {
  let data = '';
  // collecting the chunk of data as soon as they arrive
  req.on("data", chunk => {
    data += chunk;
  });
  req.on("end", () => {
    try {
      req.body = JSON.parse(data); // parse JSON only, no checks yet
      next();
    } catch (err) {
      res.status(400).send("Invalid JSON.");
    }
  });
}
// middleware 2 check if req.body is an array
function validateArrayMiddleware(req, res, next) {
  if (!Array.isArray(req.body)) {
    return res.status(400).send("Request body must be a JSON array.");
  }
  next();
}
// middleware 3: check if every item in the array is a string
function validateStringArrayMiddleware(req, res, next) {
  const allStrings = req.body.every((item) => typeof item === "string");
  if (!allStrings) {
    return res.status(400).send("All array elements must be strings.");
  }
  next();
}
// my route handler
app.post(
  "/",
  userNameMiddleware,
  parseJsonMiddleware,
  validateArrayMiddleware,
  validateStringArrayMiddleware,
  (req, res) => {
    const username = req.username;
    const subjects = req.body;
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
      response += `You have requested information about ${count} subjects: ${subjects.join(", ")}.`;
    } else {
      response += "You have requested information about 0 subjects.";
    }

    res.send(response);
  }
);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// to run: node app.js
// on another terminal: curl -X POST --data '["Bees"]' -H "X-Username: Ahmed" http://localhost:3000
