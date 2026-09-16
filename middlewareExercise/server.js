import express from "express";

const app = express();

const usernameMiddleware = (req, res, next) => {
    const usernameHeader = req.get("X-Username");

    if (usernameHeader) {
        req.username = usernameHeader;
    } else {
        req.username = null;
    }

    next();
};

const jsonBodyMiddleware = (req, res, next) => {
    let bodyData = "";

    req.on("data", (chunk) => {
        bodyData += chunk;
    });

    req.on("end", () => {
        try {
            const parsedData = JSON.parse(bodyData);

            if (!Array.isArray(parsedData)) {
                return res.status(400).send("Body must be a JSON array");
            }

            for (const subject of parsedData) {
                if (typeof subject !== "string") {
                    return res
                        .status(400)
                        .send("All array items must be strings");
                }
            }

            req.body = parsedData;

            next();
        } catch {
            return res.status(400).send("Invalid JSON");
        }
    });
};

app.post(
    "/",
    usernameMiddleware,
    jsonBodyMiddleware,
    (req, res) => {
        let authenticationMessage;

        if (req.username) {
            authenticationMessage =
                `You are authenticated as ${req.username}.`;
        } else {
            authenticationMessage =
                "You are not authenticated.";
        }

        const subjects = req.body;
        const subjectCount = subjects.length;

        let subjectsMessage =
            `You have requested information about ${subjectCount} subject`;

        if (subjectCount !== 1) {
            subjectsMessage += "s";
        }

        if (subjectCount > 0) {
            subjectsMessage += `: ${subjects.join(", ")}`;
        }

        subjectsMessage += ".";

        res.send(
            `${authenticationMessage}\n\n${subjectsMessage}\n`
        );
    }
);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
