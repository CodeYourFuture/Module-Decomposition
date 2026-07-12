const API_URL = "http://localhost:3000";

const messageForm = document.querySelector("#message-form");
const nameInput = document.querySelector("#name-input");
const messageInput = document.querySelector("#message-input");
const formStatus = document.querySelector("#form-status");
const messagesList = document.querySelector("#messages-list");
const refreshButton = document.querySelector("#refresh-button");

async function loadMessages() {
  const response = await fetch(`${API_URL}/messages`);

  if (!response.ok) {
    throw new Error("Could not load messages.");
  }

  const messages = await response.json();
  renderMessages(messages);
}

function renderMessages(messages) {
  messagesList.innerHTML = "";

  if (messages.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "message-card";
    emptyItem.textContent = "No messages yet.";
    messagesList.appendChild(emptyItem);
    return;
  }

  for (const message of messages) {
    const item = document.createElement("li");
    item.className = "message-card";

    const header = document.createElement("header");

    const author = document.createElement("strong");
    author.textContent = message.name;

    const date = document.createElement("span");
    date.className = "message-meta";
    date.textContent = new Date(message.createdAt).toLocaleString();

    const text = document.createElement("p");
    text.textContent = message.text;

    const likeButton = document.createElement("button");
    likeButton.className = "like-button";
    likeButton.type = "button";
    likeButton.textContent = `Like (${message.likes})`;
    likeButton.addEventListener("click", () => likeMessage(message.id));

    header.append(author, date);
    item.append(header, text, likeButton);
    messagesList.appendChild(item);
  }
}

async function addMessage(event) {
  event.preventDefault();

  const message = {
    name: nameInput.value.trim(),
    text: messageInput.value.trim(),
  };

  if (!message.name || !message.text) {
    formStatus.textContent = "Please enter your name and message.";
    return;
  }

  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    formStatus.textContent = "Message was not sent.";
    return;
  }

  messageInput.value = "";
  formStatus.textContent = "Message sent.";
  await loadMessages();
}

async function likeMessage(id) {
  const response = await fetch(`${API_URL}/messages/${id}/like`, {
    method: "POST",
  });

  if (!response.ok) {
    formStatus.textContent = "Could not like the message.";
    return;
  }

  await loadMessages();
}

messageForm.addEventListener("submit", addMessage);
refreshButton.addEventListener("click", loadMessages);

loadMessages().catch(() => {
  messagesList.innerHTML = "";
  const errorItem = document.createElement("li");
  errorItem.className = "message-card";
  errorItem.textContent = "Could not connect to the backend.";
  messagesList.appendChild(errorItem);
});