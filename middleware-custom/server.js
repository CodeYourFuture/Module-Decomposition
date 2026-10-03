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

const bodyMiddleware = (req, res, next) => {
  const chunks = [];

  req.on("data", (chunk) => {
    chunks.push(chunk);
  });

  req.on("end", () => {
    try {
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));

      if (!Array.isArray(body) || !body.every(item => typeof item === "string")) {
        return res
          .status(400)
          .send("Request body must be a JSON array of strings.");
      }

      req.body = body;
      next();
    } catch {
      res.status(400).send("Request body must be valid JSON.");
    }
  });
};

app.post("/", usernameMiddleware, bodyMiddleware, (req, res) => {
  res.send(
    `Username: ${req.username}\nSubjects: ${req.body.join(", ")}`
  );
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});