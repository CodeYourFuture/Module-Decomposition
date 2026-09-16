
import express from "express";

const app = express();

const usernameMiddleware = (req, res, next) => {
    req.username = req.get("X-Username") || null;
    next();
};

const validateBodyMiddleware = (req, res, next) => {
    if (!Array.isArray(req.body)) {
        return res.status(400).send("Body must be a JSON array");
    }

    for (const subject of req.body) {
        if (typeof subject !== "string") {
            return res
                .status(400)
                .send("All array items must be strings");
        }
    }

    next();
};

app.use(express.json());
app.use(usernameMiddleware);
app.use(validateBodyMiddleware);

app.post("/", (req, res) => {
    let authMessage;

    if (req.username) {
        authMessage =
            `You are authenticated as ${req.username}.`;
    } else {
        authMessage =
            "You are not authenticated.";
    }

    const requestedSubjects = req.body;
    const subjectCount = requestedSubjects.length;

    let responseMessage =
        `You have requested information about ${subjectCount} subject`;

    if (subjectCount !== 1) {
        responseMessage += "s";
    }

    if (subjectCount > 0) {
        responseMessage += `: ${requestedSubjects.join(", ")}`;
    }

    responseMessage += ".";

    res.send(
        `${authMessage}\n\n${responseMessage}\n`
    );
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
