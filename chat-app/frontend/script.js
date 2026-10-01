const usernameInput = document.getElementById("usernameInput");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messagesDiv = document.getElementById("messages");
const feedback = document.getElementById("feedback");


sendButton.addEventListener("click", sendMessage);


messageInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }

});


function sendMessage() {

    const username = usernameInput.value.trim();
    const content = messageInput.value.trim();

    if (username === "") {
        feedback.textContent = "Please enter your name.";
        return;
    }

    if (content === "") {
        feedback.textContent = "Message cannot be empty.";
        return;
    }

    fetch(`http://localhost:8081/messages?username=${encodeURIComponent(username)}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: content
        })
    })
        .then(response => {

            if (!response.ok) {
                throw new Error("Message could not be sent.");
            }

            return response.json();
        })
        .then(() => {

            messageInput.value = "";
            feedback.textContent = "";

            loadMessages();
        })
        .catch(error => {

            feedback.textContent = error.message;
        });
}


function loadMessages() {

    fetch("http://localhost:8081/messages")
        .then(response => {

            if (!response.ok) {
                throw new Error("Could not load messages.");
            }

            return response.json();
        })
        .then(messages => {

            messagesDiv.innerHTML = "";

            messages.forEach(message => {

                const messageElement = document.createElement("div");
                messageElement.classList.add("message");

                const usernameElement = document.createElement("span");
                usernameElement.classList.add("username");

                const contentElement = document.createElement("span");
                contentElement.classList.add("content");

                const timestampElement = document.createElement("span");
                timestampElement.classList.add("timestamp");


                if (message.user) {

                    usernameElement.textContent =
                        message.user.username + ":";

                } else {

                    usernameElement.textContent = "Unknown user:";
                }


                contentElement.textContent = message.content;

                timestampElement.textContent =
                    message.createdAt
                        ? new Date(message.createdAt).toLocaleString()
                        : "";


                messageElement.appendChild(usernameElement);
                messageElement.appendChild(contentElement);
                messageElement.appendChild(timestampElement);

                messagesDiv.appendChild(messageElement);
            });

            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        })
        .catch(error => {

            feedback.textContent = error.message;
        });
}


loadMessages();

setInterval(loadMessages, 2000);