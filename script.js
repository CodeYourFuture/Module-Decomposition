import express from "express"
const app = express();
const port = 3000;

function usernameExtractor(req, res, next) {
  const username = req.get("X-Username");
  req.username = username ? username : null;
  next();
}

app.post("/", usernameExtractor,(req, res) => {
  const username = req.username;
  const subjects = req.body;

    if (!Array.isArray(subjects)) {
        return res.status(400).send("Error: Body must be a JSON array.");
    }



  res.send(response);
});