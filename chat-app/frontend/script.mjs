// WebSocket connection
const socket = new WebSocket("ws://localhost:8080");

// HTML elements
const messagesContainer = document.querySelector("#messages");
const form = document.querySelector("#message-form");
const usernameInput = document.querySelector("#username");
const messageInput = document.querySelector("#message-input");
const colourInput = document.querySelector("#colour");
const scheduleInput = document.querySelector("#schedule");
const boldButton = document.querySelector("#bold-button");
const italicButton = document.querySelector("#italic-button");
const underlineButton = document.querySelector("#underline-button");
const connectionStatus = document.querySelector("#connection-status");
const replyPreview = document.querySelector("#reply-preview");
const replyText = document.querySelector("#reply-text");
const cancelReplyButton = document.querySelector("#cancel-reply");

// Formatting state
let formatting = {
  bold: false,
  italic: false,
  underline: false
};

// Reply state
let replyTo = null;
// In-memory message cache (client-side)
const messageCache = new Map();

// WebSocket opened
socket.addEventListener("open", () => {
  connectionStatus.textContent = "🟢 Connected";
});
// Receive data
socket.addEventListener("message", (event) => {
  try {
    const data = JSON.parse(event.data);

    // Existing messages
    if (data.type === "messages") {
      messagesContainer.innerHTML = "";
      messageCache.clear();

      data.messages.forEach((message) => {
        messageCache.set(message.id, message);
        addMessage(message);
      });
    }
    // New message
    else if (data.type === "message") {
      messageCache.set(data.message.id, data.message);
      addMessage(data.message);
    }
    // Updated message
    else if (data.type === "message-updated") {
      messageCache.set(data.message.id, data.message);
      updateMessage(data.message);
    }
    // Scheduled
    else if (data.type === "scheduled") {
      alert(data.message);
    }
    // Error
    else if (data.type === "error") {
      alert(data.message);
    }
  } catch (error) {
    console.error("Could not process server message:", error);
  }
});

// Add message
function addMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.dataset.messageId = message.id;

  // Reply information
  if (message.replyTo) {
    const originalMessage = messageCache.get(message.replyTo);
    const replyBox = document.createElement("div");
    replyBox.classList.add("reply-reference");

    if (originalMessage) {
      replyBox.textContent = `↩ Replying to ${originalMessage.username}: ${originalMessage.text}`;
    } else {
      replyBox.textContent = "↩ Replying to another message";
    }

    div.appendChild(replyBox);
  }

  // Username
  const username = document.createElement("strong");
  username.textContent = message.username;
  username.style.color = message.colour || "#3f6ff5";

  // Message text
  const text = document.createElement("p");
  text.textContent = message.text;
  text.style.color = message.colour || "#000000";

  // Formatting
  if (message.formatting?.bold) {
    text.style.fontWeight = "bold";
  }
  if (message.formatting?.italic) {
    text.style.fontStyle = "italic";
  }
  if (message.formatting?.underline) {
    text.style.textDecoration = "underline";
  }

  // Reactions
  const reactions = document.createElement("div");
  reactions.classList.add("reactions");

  // Like button
  const likeButton = document.createElement("button");
  likeButton.textContent = `👍 ${message.likes ?? 0}`;
  likeButton.addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "like-message",
        messageId: message.id
      })
    );
  });

  // Dislike button
  const dislikeButton = document.createElement("button");
  dislikeButton.textContent = `👎 ${message.dislikes ?? 0}`;
  dislikeButton.addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "dislike-message",
        messageId: message.id
      })
    );
  });

  // Reply button
  const replyButton = document.createElement("button");
  replyButton.textContent = "↩ Reply";
  replyButton.addEventListener("click", () => {
    startReply(message);
  });

  // Put buttons together
  reactions.appendChild(likeButton);
  reactions.appendChild(dislikeButton);
  reactions.appendChild(replyButton);

  // Build message
  div.appendChild(username);
  div.appendChild(text);
  div.appendChild(reactions);

  messagesContainer.appendChild(div);

  // Scroll to newest message
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Update message
function updateMessage(message) {
  const existing = document.querySelector(
    `[data-message-id="${message.id}"]`
  );
  if (!existing) {
    return;
  }
  existing.remove();
  addMessage(message);
}

// Start reply
function startReply(message) {
  replyTo = message.id;
  replyText.textContent = `${message.username}: ${message.text}`;
  replyPreview.classList.remove("hidden");
  messageInput.focus();
}

// Cancel reply
cancelReplyButton.addEventListener("click", () => {
  replyTo = null;
  replyPreview.classList.add("hidden");
  replyText.textContent = "";
});

// Formatting buttons
boldButton.addEventListener("click", () => {
  formatting.bold = !formatting.bold;
  boldButton.classList.toggle("active", formatting.bold);
});

italicButton.addEventListener("click", () => {
  formatting.italic = !formatting.italic;
  italicButton.classList.toggle("active", formatting.italic);
});

underlineButton.addEventListener("click", () => {
  formatting.underline = !formatting.underline;
  underlineButton.classList.toggle("active", formatting.underline);
});

// Send message
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const text = messageInput.value.trim();
  const colour = colourInput.value;
  const scheduledFor = scheduleInput.value;

  // Validation
  if (!username || !text) {
    return;
  }

  if (socket.readyState !== WebSocket.OPEN) {
    alert("Not connected to the chat server.");
    return;
  }

  // Create request
  const request = {
    type: scheduledFor ? "schedule-message" : "send-message",
    username,
    text,
    colour,
    formatting: { ...formatting },
    replyTo
  };

  // Add schedule
  if (scheduledFor) {
    const date = new Date(scheduledFor);
    request.scheduledFor = date.toISOString();
  }

  // Send
  socket.send(JSON.stringify(request));

  // Reset
  messageInput.value = "";
  scheduleInput.value = "";
  formatting = {
    bold: false,
    italic: false,
    underline: false
  };
  boldButton.classList.remove("active");
  italicButton.classList.remove("active");
  underlineButton.classList.remove("active");
  replyTo = null;
  replyPreview.classList.add("hidden");
  replyText.textContent = "";
  messageInput.focus();
});

// WebSocket error
socket.addEventListener("error", (error) => {
  console.error("WebSocket error:", error);
  connectionStatus.textContent = "🔴 Connection error";
});

// WebSocket closed
socket.addEventListener("close", () => {
  console.log("Disconnected from chat server");
  connectionStatus.textContent = "🔴 Disconnected";
});