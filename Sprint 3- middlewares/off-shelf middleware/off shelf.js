const express = require("express");

const app = express();
const PORT = 3000;

// Built-in Express JSON middleware
app.use(express.json());

// Custom username middleware
function usernameMiddleware(req, res, next) {
    const username = req.get("X-Username");

    if (username) {
        req.username = username;
    } else {
        req.username = null;
    }

    next();
}

app.use(usernameMiddleware);

// POST endpoint
app.post("/", (req, res) => {
    const subjects = req.body;

    if (!Array.isArray(subjects) ||
        !subjects.every((subject) => typeof subject === "string")) {
        return res.status(400).send("Invalid request body.");
    }

    const authenticationMessage = req.username
    ? `You are authenticated as ${req.username}.`
    : "You are not authenticated.";

    res.send(
        authenticationMessage + "\n\n" +
        `You have requested information about ${subjects.length} ` +
        `${subjects.length === 1 ? "subject" : "subjects"}` +
        `${subjects.length > 0 ? ": " + subjects.join(", ") : ""}.`
    );
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});