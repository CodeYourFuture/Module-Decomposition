// Default name used for the first chats. Change this if you want a different one.
const DEFAULT_USERNAME = "Anonymous";

// REQUIRED FOR DEPLOYMENT: set this to your deployed backend URL,
// e.g. "https://my-chat-backend.onrender.com".
// Leave it empty ONLY for local development, where the backend also serves this page.
const BACKEND_URL = "";

const IS_LOCAL = ["localhost", "127.0.0.1", ""].includes(location.hostname);

document.addEventListener("DOMContentLoaded", () => {
  const chats = document.getElementById("chats");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat");
  const onlineCount = document.getElementById("online-count");
  const welcomeUser = document.getElementById("welcome-user");

  // Without a backend URL the page is deployed but inert, and the failure is
  // silent. Say so loudly instead of showing an empty chat that never works.
  if (!BACKEND_URL && !IS_LOCAL) {
    welcomeUser.textContent =
      "⚠️ BACKEND_URL is not set in app.js — the chat cannot connect.";
    form.hidden = true;
    return;
  }

  const socket = BACKEND_URL ? io(BACKEND_URL) : io();

  let username = localStorage.getItem("chatUsername");

  if (!username || !username.trim()) {
    const entered = prompt("Enter your name:", DEFAULT_USERNAME);
    username = entered && entered.trim() ? entered.trim() : DEFAULT_USERNAME;
    localStorage.setItem("chatUsername", username);
  }

  welcomeUser.textContent = `👋 Welcome, ${username}`;

  function scrollToBottom() {
    chats.scrollTop = chats.scrollHeight;
  }

  function createMessageElement(data) {
    const p = document.createElement("p");
    p.textContent = `[${data.timestamp}] ${data.user}: ${data.message}`;
    if (data.user === username) {
      p.classList.add("my-message");
    }
    return p;
  }

  // Re-announce on every connect, not just the first: hosts drop idle sockets,
  // and after a reconnect the server no longer knows who this socket is.
  socket.on("connect", () => {
    socket.emit("new_user", username);
  });

  // The server replays the backlog on every connection, so start from a clean
  // box or a reconnect shows the whole history twice.
  socket.on("chat_history", (messages) => {
    chats.replaceChildren();
    messages.forEach((msg) => chats.appendChild(createMessageElement(msg)));
    scrollToBottom();
  });

  socket.on("broadcast_message", (data) => {
    chats.appendChild(createMessageElement(data));
    scrollToBottom();
  });

  socket.on("user_connected", (data) => {
    const p = document.createElement("p");
    p.classList.add("system-message");
    p.textContent = `🟢 ${data.user} joined the chat`;
    chats.appendChild(p);
    scrollToBottom();
  });

  socket.on("user_count", (count) => {
    onlineCount.textContent = `👥 ${count} online`;
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    socket.emit("new_message", message);
    form.reset();
    input.focus();
  });
});
