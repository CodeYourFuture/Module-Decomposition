const express = require('express');
const app = express();

const port = process.env.PORT || 3000;


const usernameCustomMiddleware = (req, res, next) => {
  const username = req.headers["username"];
  req.name = username ? username : null;
  next();
}

const jsonBodyMustBeAnArrayMiddleware = (req, res, next) => {
  let raw = "";
  let chunks = [];

  req.on("data", (chunk) => {
    chunks.push(chunk);
  });

  req.on("end", () => {
    try {
      raw = Buffer.concat(chunks).toString("utf8");
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return res.status(400).type("text").send("Bad Request: Expected a JSON array in the request body.");
      }

      const confirmString = parsed.every(item => typeof item === "string");

      if (!confirmString) {
        return res.status(400).type("text").send("Bad Request: Expected a JSON array of strings in the request body.");
      }

      req.body = parsed;
      next();

    } catch (error) {
      return res.status(400).type("text").send("Bad Request: Invalid JSON in the request body.");
    }

  })

  req.on("error", () => {
    return res.status(400).type("text").send("Bad Request: Error reading the request body.");
  })

}


app.post("/custom-middleware", usernameCustomMiddleware, jsonBodyMustBeAnArrayMiddleware, (req, res) => {
  try {
    
    const username = req.name;
    const subject = req.body;
    const count = subject.length;
    
    if (!username) {
      return res.status(401).type("text").send("Unauthorized: Missing or invalid username in the request headers.");
    }

    const authentication = username
      ? `You are authenticated as ${username}`
      : "You are not authenticated";

    let subjectResponse = `You have requested info about ${count} subject${count === 1 ? "" : "s"}`;
    subjectResponse += count > 0 ? `: ${subject.join(", ")}.` : `.`;

    res.status(200).type("text").send(`\n${authentication}\n${subjectResponse}`);

  } catch (error) {
    return res.status(500).type("text").send("Internal Server Error.");
  }
})

app.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
})