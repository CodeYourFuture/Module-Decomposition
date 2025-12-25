const showQuoteButton = document.getElementById("showQuoteBtn");
const quoteText = document.getElementById("quoteText");
console.log("Button:", showQuoteButton);
console.log("Quote element:", quoteText);

showQuoteButton.addEventListener("click",async()=>{
    const response = await fetch("http://localhost:3000/");
    const quote=await response.text();
    quoteText.textContent=quote;

})