// Get reference to the "Show random Quote" button
const showQuoteButton = document.getElementById("showQuoteBtn");

// Get reference to the paragraph where the quote will be displayed
const quoteText = document.getElementById("quoteText");

console.log("Button:", showQuoteButton);
console.log("Quote element:", quoteText);

// Add a click event listener to the button
showQuoteButton.addEventListener("click", async () => {
  try{
    // Send a GET request to the backend server
    const response = await fetch("http://localhost:3000/");

    // Read the response body as plain text
    const quote = await response.text();

    // Display the quote inside the paragraph
    quoteText.textContent = quote;
  }catch(error){
    // If something goes wrong (server down, CORS, network error)
    console.log(error);
    quoteText.textContent = "Failed to load quote.";
  }
  
  
});
