// Import Express framework to create a web server
import express from "express";

// Import CORS middleware to allow requests from other origins (e.g. frontend)
import cors from "cors";

// Create an Express application
const app = express();

// Define the port where the backend server will run
const port = 3000;

// Enable CORS for all origins
// This allows the frontend (running on a different port)
// to communicate with this backend
app.use(cors());

// In-memory storage for quotes
// NOTE: This data will be lost when the server restarts
const quotes = [
  {
    quote:
      "Either write something worth reading or do something worth writing.",
    author: "Benjamin Franklin",
  },
  {
    quote: "I should have been more kind.",
    author: "Clive James",
  },
];

// Helper function to return a random quote from the array
function randomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

// GET endpoint
// When the frontend sends a GET request to "/",
// return a random quote as a formatted string
app.get("/", (req, res) => {
  const quote = randomQuote();
  res.send(`"${quote.quote}" -${quote.author}`);
});

// POST endpoint
// This allows users to add a new quote
app.post("/", (req, res) => {
  const bodyBytes = [];

  // Collect incoming request data chunks
  req.on("data", (chunk) => bodyBytes.push(...chunk));

  // When all data is received
  req.on("end", () => {
    const bodyString = String.fromCharCode(...bodyBytes);
    let body;

    // Try to parse the request body as JSON
    try {
      body = JSON.parse(bodyString);
    } catch (error) {
      console.error(`Failed to parse body ${bodyString} as JSON: ${error}`);
      res.status(400).send("Expected body to be JSON.");
      return;
    }

    // Validate that the required fields exist
    if (typeof body != "object" || !("quote" in body) || !("author" in body)) {
      console.error(
        `Failed to extract quote and author from post body: ${bodyString}`
      );
      res
        .status(400)
        .send(
          "Expected body to be a JSON object containing keys quote and author."
        );
      return;
    }

    // Add the new quote to the in-memory array
    quotes.push({
      quote: body.quote,
      author: body.author,
    });

    // Send success response
    res.send("ok");
  });
});

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.error(`Quote server listening on port ${port}`);
});
