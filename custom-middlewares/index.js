const express = require("express");

const app = express();
const PORT = 3000;

// temporary route – no middleware yet
app.post("/", (req, res) => {
  res.send("App is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

