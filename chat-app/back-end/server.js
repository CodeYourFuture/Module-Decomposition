const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Set CORS_ORIGIN to your deployed frontend URL. "*" is fine for local dev.
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

// Keeps memory bounded on a small host: the backlog is capped, and so is each message.
const MAX_HISTORY = 200;
const MAX_MESSAGE_LENGTH = 500;

const io = socketio(server, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

const users = {};
const lastSeen = {};
const messages = [];

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Serves the frontend too, so the whole app runs with one command locally.
// In production the frontend is deployed separately and this is simply unused.
app.use(express.static(path.join(__dirname, "..", "front-end")));

app.get("/health", (req, res) => {
  res.send("World Chat backend is running");
});

io.on("connection", (socket) => {
  socket.emit("chat_history", messages);

  socket.on("new_user", (name) => {
    if (typeof name !== "string" || !name.trim()) return;

    const username = name.trim().slice(0, 32);
    const now = Date.now();
    const shouldAnnounce =
      !lastSeen[username] || now - lastSeen[username] > 10 * 60 * 1000;

    users[socket.id] = username;

    if (shouldAnnounce) {
      io.emit("user_connected", {
        user: username,
        timestamp: new Date().toLocaleString(),
      });
    }

    lastSeen[username] = now;
    io.emit("user_count", Object.keys(users).length);
  });

  socket.on("new_message", (message) => {
    if (typeof message !== "string" || !message.trim()) return;
    if (message.length > MAX_MESSAGE_LENGTH) return;

    const chatMessage = {
      user: users[socket.id] || "Anonymous",
      message,
      timestamp: new Date().toLocaleString(),
    };

    messages.push(chatMessage);
    if (messages.length > MAX_HISTORY) messages.shift();

    io.emit("broadcast_message", chatMessage);
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    delete users[socket.id];
    if (username) lastSeen[username] = Date.now();
    io.emit("user_count", Object.keys(users).length);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
