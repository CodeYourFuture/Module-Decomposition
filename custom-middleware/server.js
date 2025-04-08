import express from "express";

const app = express();

const authenticate = (req, res, next) => {
  if (req.headers["x-username"]) {
    req.username = req.headers["x-username"];
    console.log(req.headers)
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

app.post("/", (req, res) => {
  const { username } = req;
  username ? res.send(`You are authenticated as ${username}`): res.send('You are not authenticated')
});

app.listen(3000, () => console.log("Server is listening at port 3000..."));
