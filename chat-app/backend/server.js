import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

const messages = [];
const callbacksForNewMessages = [];

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Chat backend is running!");
});

app.get("/messages", (req, res) => {
  const since = req.query.since;

  let messagesToSend;

  if (since === undefined) {
    messagesToSend = messages;
  } else {
    const sinceId = Number(since);

    messagesToSend = messages.filter(
      (message) => message.id > sinceId
    );
  }

  if (messagesToSend.length === 0) {
    callbacksForNewMessages.push((value) => res.json(value));
  } else {
    res.json(messagesToSend);
  }
});

app.post("/messages", (req, res) => {
  const { username, text, color } = req.body;

  if (!username || username.trim() === "") {
    return res.status(400).json({
      error: "Username is required",
    });
  }

  if (!text || text.trim() === "") {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  const message = {
    id: messages.length,
    username: username.trim(),
    text: text.trim(),
    color: color,
  };

  messages.push(message);

  while (callbacksForNewMessages.length > 0) {
    const callback = callbacksForNewMessages.pop();

    callback([message]);
  }

  res.status(201).json(message);
});

app.listen(port, () => {
  console.log(`Chat server listening on port ${port}`);
});