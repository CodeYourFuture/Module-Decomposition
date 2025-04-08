import express from "express";

const app = express();

const authenticate = (req, res, next) => {
  if (req.headers["X-Username"]) {
    req.username = req.headers["X-Username"];
  } else {
    req.username = null;
  }
  next();
};

const passRequestPostBodyAsJSONArray = (req, res, next) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const jsonBody = JSON.parse(body);
      if (
        Array.isArray(jsonBody) &&
        jsonBody.every((item) => typeof item === "string")
      ) {
        req.body = jsonBody;
        next();
      } else {
        res.status(400).send("Body must be an array of strings");
      }
    } catch (e) {
      res.status(400).send("Invalid JSON format");
    }
  });

  req.on("error", () => {
    res.status(500).send("Error processing request");
  });
};

app.use(authenticate);
app.use(passRequestPostBodyAsJSONArray);
