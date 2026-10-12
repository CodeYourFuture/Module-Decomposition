import express from "express";

const app = express();

function usernameMiddleware(req, res, next) {
  const username = req.get("X-Username");

  if (username) {
    req.username = username;
  } else {
    req.username = null;
  }

  next();
}

app.use(express.json());

function bodyValidationMiddleware(req, res, next) {
  if (!Array.isArray(req.body)) {
    return res.status(400).send("Request body must be a JSON array.");
  }

  if (!req.body.every((item) => typeof item === "string")) {
    return res.status(400).send("Array must contain only strings.");
  }

  next();
}

app.use(bodyValidationMiddleware);
app.use(usernameMiddleware);

app.post("/", (req, res) => {
  const subjects = req.body;

  if (req.username) {
    res.send(
      `You are authenticated as ${req.username}.\n\n` +
        `You have requested information about ${subjects.length} ` +
        `${subjects.length === 1 ? "subject" : "subjects"}` +
        `${subjects.length > 0 ? `: ${subjects.join(", ")}` : ""}.`,
    );
  } else {
    res.send(
      `You are not authenticated.\n\n` +
        `You have requested information about ${subjects.length} ` +
        `${subjects.length === 1 ? "subject" : "subjects"}` +
        `${subjects.length > 0 ? `: ${subjects.join(", ")}` : ""}.`,
    );
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
