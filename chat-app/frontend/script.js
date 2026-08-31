console.log("JavaScript connected!");

let chatMessages = document.getElementById("chatMessages");
let messageForm = document.getElementById("messageForm");
let nameInput = document.getElementById("name");
let messageText = document.getElementById("message");

//Automatically select Local Host or Live domain on Coolify
const API_Base_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
? 'http://localhost:3000'
: 'https://odeocv9kcjsiyvq7hlqwglko.trainees.hosting.cyf.academy/';

const API_URL = `${API_Base_URL}/api/message`;

//While page open or refresh get data from backend (GET Method)

async function loadMessages(){
    try {
        const response = await fetch(`${API_URL}`);

        if (!response.ok){
            throw new Error (`Server Error: ${response.status}`)
        }
        const data = await response.json();

        //clear the HTML elements inside the message content container
        chatMessages.innerHTML="";

        console.log(typeof(data));
        console.log("Value:",data);

        data.forEach(({name,message}) =>{
            const chatContent = document.createElement("div");
            chatContent.style.border = "1px solid black";
            chatContent.style.borderRadius = "3px";

        //name content
        const nameArea = document.createElement("div");
        nameArea.textContent = name;
        nameArea.style.color = "blue";

        // message content
        const messageArea = document.createElement("div");
        messageArea.textContent = message;

        chatContent.appendChild(nameArea);
        chatContent.appendChild(messageArea);

        chatMessages.appendChild(chatContent);

        });

    }
    catch(err)
    {
        console.error ('Error fetching messages :',err);
    }
   
}

window.addEventListener('DOMContentLoaded',loadMessages);

//while click send button, send data to backend and show the data & status (POST Method)
messageForm.addEventListener("submit",async (e) =>{
    e.preventDefault();   //prevent page load while submit

    //extract values (name & message)
    const name = nameInput.value.trim().toLowerCase();
    const message = messageText.value.trim();

    //data validation
    if (!name && ! message)
    {
        chatMessages.textContent = "Name & Message cannot blank";
        chatMessages.style.color = "red";
        return;
    }
    // clear any older error message
    chatMessages.textContent = "";

    //sending data to backend

    try{
        await fetch(`${API_URL}`,{
            method : 'POST',
            headers: {'Content-Type': 'application/json'},
            //js object to json string
            body : JSON.stringify({name:name,message:message})

        });

        //clean the message input 
        messageText.value = '';
        await loadMessages();
    }
    catch(error)
    {
            console.error("Error posting Message",error);
    }
}
);

