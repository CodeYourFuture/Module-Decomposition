//create the app using express
const express = require("express");
const app = express();
//my fiirst middleware , request/get the header and attach it to req
function userNameMiddleware(req, res, next) {
    const username = req.header("X-Username");  
    req.username = username ? username : null;
    next(); //to pass control onward
}

//my second middleware jsonarray middleware