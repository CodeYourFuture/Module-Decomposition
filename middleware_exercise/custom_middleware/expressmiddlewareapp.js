//create the app using express
const express = require("express");
const app = express();
//my first middleware , request/get the header and attach it to req

function userNameMiddleware(req, res, next) {
    const username = req.header("X-Username");  
    req.username = username ? username : null;
    next(); //to pass control onward
}

//my second middleware json array middleware.. manually parsing raw body into json
function jsonArrayMiddleware(req, res, next) {
    let data = '';
    
    //collecting the chunk of data as soon as they arrive
    req.on("data", chunk => {
        data += chunk;
    });
    
    req.on("end", () => {
      try {
        const parsed = JSON.parse(data);

        //checking if it is an array
        if (!Array.isArray(parsed)) {
          return res.status(400).send("Request body must be a JSON array.");
        }
        // check every item is a string
        const allStrings = parsed.every((item) => typeof item === "string");
        if (!allStrings) {
          return res.status(400).send("All array elements must be strings.");
        }

        req.body = parsed;
        next();
      } catch (err) {
        res.status(400).send("Invalid JSON.");
      }
    });
}

//my route handler
app.post("/", userNameMiddleware, jsonArrayMiddleware, (req, res) => {
  const username = req.username;
  const subjects = req.body;
  const count = subjects.length;

  let response = "";

  // Auth message
  if (username) {
    response += `You are authenticated as ${username}.\n\n`;
  } else {
    response += "You are not authenticated.\n\n";
  }

  // Subject count message
  if (count === 1) {
    response += `You have requested information about 1 subject: ${subjects[0]}.`;
  } else if (count > 1) {
    response += `You have requested information about ${count} subjects: ${subjects.join(
      ", "
    )}.`;
  } else {
    response += "You have requested information about 0 subjects.";
  }

  res.send(response);
});

//start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

//to run node app.js
//on other terminal  curl -X POST --data '["Bees"]' -H "X-Username: Ahmed" http://localhost:3000
