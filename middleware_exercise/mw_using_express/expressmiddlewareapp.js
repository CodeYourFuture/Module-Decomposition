//create the app using express
const express = require("express");
const app = express();
//my fiirst middleware , request/get the header and attach it to req
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