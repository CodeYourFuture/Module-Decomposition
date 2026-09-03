import express from "express";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";

const app = express();

app.use(cors());
app.use(express.json());

const messages = [];
let nextMessageId = 1;

// HTTP route
app.get("/", (req, res) => {
  res.json({
    message: "Chat server is running"
  });
});

// Start HTTP server
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`HTTP server running on port ${PORT}`);
});

// WebSocket server
const wss = new WebSocketServer({
  server
});

// WebSocket connection
wss.on("connection", (socket) => {
  // Send all existing messages
  socket.send(
    JSON.stringify({
      type: "messages",
      messages
    })
  );

  // Receive message
  socket.on("message", (data) => {
    try {
      const request = JSON.parse(data.toString());

      // SEND MESSAGE
      if (request.type === "send-message") {
        createMessage(request);
      }

      // LIKE MESSAGE
      else if (request.type === "like-message") {
        const message = messages.find(
          (message) => message.id === request.messageId
        );

        if (!message) {
          return;
        }

        message.likes++;

        broadcast({
          type: "message-updated",
          message
        });
      }

      // DISLIKE MESSAGE
      else if (request.type === "dislike-message") {
        const message = messages.find(
          (message) => message.id === request.messageId
        );

        if (!message) {
          return;
        }

        message.dislikes++;

        broadcast({
          type: "message-updated",
          message
        });
      }

      // SCHEDULE MESSAGE
      else if (request.type === "schedule-message") {
        scheduleMessage(request, socket);
      }

      // UNKNOWN REQUEST
      else {
        socket.send(
          JSON.stringify({
            type: "error",
            message: "Unknown request type."
          })
        );
      }
    } catch (error) {
      console.error("Invalid message:", error);

      socket.send(
        JSON.stringify({
          type: "error",
          message: "Invalid request."
        })
      );
    }
  });

  // Client disconnected
  socket.on("close", () => {
    console.log("Client disconnected");
  });

  // WebSocket error
  socket.on("error", (error) => {
    console.error("WebSocket error:", error.message);
  });
});

// Create message
function createMessage(request) {
  const message = {
    id: nextMessageId++,
    username: request.username,
    text: request.text,
    likes: 0,
    dislikes: 0,
    colour: request.colour || "#000000",
    formatting: {
      bold: request.formatting?.bold || false,
      italic: request.formatting?.italic || false,
      underline: request.formatting?.underline || false
    },
    replyTo: request.replyTo || null,
    createdAt: new Date().toISOString()
  };

  messages.push(message);

  broadcast({
    type: "message",
    message
  });
}

// Schedule message
function scheduleMessage(request, socket) {
  const scheduledTime = new Date(request.scheduledFor).getTime();
  const now = Date.now();

  if (Number.isNaN(scheduledTime)) {
    socket.send(
      JSON.stringify({
        type: "error",
        message: "Invalid scheduled date."
      })
    );
    return;
  }

  if (scheduledTime <= now) {
    socket.send(
      JSON.stringify({
        type: "error",
        message: "Scheduled time must be in the future."
      })
    );
    return;
  }

  const delay = scheduledTime - now;

  setTimeout(() => {
    const message = {
      id: nextMessageId++,
      username: request.username,
      text: request.text,
      likes: 0,
      dislikes: 0,
      colour: request.colour || "#000000",
      formatting: {
        bold: request.formatting?.bold || false,
        italic: request.formatting?.italic || false,
        underline: request.formatting?.underline || false
      },
      replyTo: request.replyTo || null,
      createdAt: new Date().toISOString(),
      scheduledFor: request.scheduledFor
    };

    messages.push(message);

    broadcast({
      type: "message",
      message
    });
  }, delay);

  socket.send(
    JSON.stringify({
      type: "scheduled",
      message: "Message scheduled successfully."
    })
  );
}

// Broadcast
function broadcast(data) {
  const message = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}