// Get reference to the "Show random Quote" button
const showQuoteButton = document.getElementById("showQuoteBtn");

// Get reference to the paragraph where the quote will be displayed
const quoteText = document.getElementById("quoteText");
const quoteInsertForm = document.getElementById("quoteForm");

console.log("Button:", showQuoteButton);
console.log("Quote element:", quoteText);

// Add a click event listener to the button
showQuoteButton.addEventListener("click", async () => {
  try {
    // Send a GET request to the backend server
    const response = await fetch("http://localhost:3000/");

    // Read the response body as plain text
    const quote = await response.text();

    // Display the quote inside the paragraph
    quoteText.textContent = quote;
  } catch (error) {
    // If something goes wrong (server down, CORS, network error)
    console.log(error);
    quoteText.textContent = "Failed to load quote.";
  }
});
quoteInsertForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const quote = document.getElementById("newQuote").value;
  const author = document.getElementById("newQuoteAuthor").value;

  const data = { quote, author };

  const response = await fetch("http://localhost:3000/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.text();
  console.log(result);
});
