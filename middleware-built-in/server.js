const express = require("express");

const app = express();

const usernameMiddleware = (req, res, next) => {
  const username = req.get("X-Username");

  if (username) {
    req.username = username;
  } else {
    req.username = null;
  }

  next();
};

app.use(express.json());

const validateSubjects = (req, res, next) => {
  if (!Array.isArray(req.body) || !req.body.every(item => typeof item === "string")) {
    return res
      .status(400)
      .send("Request body must be a JSON array of strings.");
  }

  next();
};

app.post("/", usernameMiddleware, validateSubjects, (req, res) => {
  res.send(
    `Username: ${req.username}\nSubjects: ${req.body.join(", ")}`
  );
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});