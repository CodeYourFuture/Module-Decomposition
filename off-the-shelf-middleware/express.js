import express from "express";
const app = express();

const assignHeader = (req, res, next) => {
  req.username = req.headers["x-username"] ? req.headers["x-username"] : null;
  next();
};

app.use(assignHeader);
app.use(express.json());

// add `-H 'Content-Type: application/json'` to curl request
//curl -X POST --data '["Bees"]' -H 'Content-Type: application/json'  -H "X-Username: Ahmed" http://localhost:3000
// this will match Content-Type header with the type option.

app.post("/", (req, res) => {
  let message = [];
  if (req.username) {
    message.push(`You are authenticated as ${req.username}`);
  } else {
    message.push("You are not authenticated.");
  }
  if (req.body.length > 0) {
    message.push(
      `You have requested information about ${
        req.body.length
      } subjects: ${req.body.join(", ")}\n`
    );
  } else {
    message.push("You have requested information about 0 subjects.\n");
  }
  res.send(message.join("\n\n"));
});

app.listen(3000, () => {
  console.error(`server listening on port 3000`);
});
