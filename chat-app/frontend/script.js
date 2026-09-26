const serverUrl = "https://fithi-chat-app-backend.trainees.hosting.cyf.academy";
let lastMessageId = null;
const usernameInput = document.getElementById("usernameInput");
const messageInput = document.getElementById("messageInput");
const colorInput = document.getElementById("colorInput");
const sendButton = document.getElementById("sendButton");
const messagesContainer = document.getElementById("messages");
const errorMessage = document.getElementById("errorMessage");

async function getMessages() {
  const url =
    lastMessageId === null
      ? `${serverUrl}/messages`
      : `${serverUrl}/messages?since=${lastMessageId}`;

  const response = await fetch(url);

  if (!response.ok) {
    console.error("Server returned:", response.status);
    return;
  }

  const messages = await response.json();
 
  messages.forEach((message) => {
    const messageElement = document.createElement("p");
    messageElement.textContent = `${message.username}: ${message.text}`;
    messageElement.style.color = message.color;

    // const likeButton = document.createElement("button");
    // likeButton.textContent = `👍 ${message.likes}`;

    // likeButton.addEventListener("click", () => {
    //   likeMessage(message.id);
    // });
    messagesContainer.appendChild(messageElement);
    // messagesContainer.appendChild(likeButton);
  });
  if (messages.length > 0) {
    lastMessageId = messages[messages.length - 1].id;
  }
  getMessages();
}

// async function likeMessage(messageId) {
//   const response = await fetch(`${serverUrl}/messages/${messageId}/like`, {
//     method: "POST",
//   });

//   if (!response.ok) {
//     console.error("Could not like message");
//     return;
//   }
// }

async function sendMessage() {
  const username = usernameInput.value.trim();
  const messageText = messageInput.value.trim();
  const color = colorInput.value;

  if (username === "") {
    errorMessage.textContent = "Please enter your name.";
    return;
  }

  if (messageText === "") {
    errorMessage.textContent = "Please enter a message.";
    return;
  }

  errorMessage.textContent = "";

  const response = await fetch(`${serverUrl}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      text: messageText,
      color: color,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    errorMessage.textContent = error.error;
    return;
  }

  messageInput.value = "";
  usernameInput.value = "";
}

sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

getMessages();


