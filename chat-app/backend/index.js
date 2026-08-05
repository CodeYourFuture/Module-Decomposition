const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let messages = [];

app.get("/", (req, res) => {
  res.json({ status: "Chat backend is running" });
});

app.get("/messages", (req, res) => {
  res.json(messages);
});

app.post("/messages", (req, res) => {
  const { name, text } = req.body;

  if (!name || !text) {
    return res.status(400).json({ error: "Name and message are required." });
  }

  const message = {
    id: Date.now(),
    name,
    text,
    likes: 0,
    createdAt: new Date().toISOString(),
  };

  messages.push(message);
  res.status(201).json(message);
});

app.post("/messages/:id/like", (req, res) => {
  const id = Number(req.params.id);
  const message = messages.find((item) => item.id === id);

  if (!message) {
    return res.status(404).json({ error: "Message not found." });
  }

  message.likes += 1;
  res.json(message);
});

app.listen(port, () => {
  console.log(`Chat backend listening on port ${port}`);
});