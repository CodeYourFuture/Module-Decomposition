const express = require("express");
const extractUsername = require("./middleware/extractUsername");
const parseJsonArrayBody = require("./middleware/parseJsonArrayBody");
const app = express();

app.post("/subjects",extractUsername,parseJsonArrayBody,
  (req, res) => {

    const auth = req.username
      ? `You are authenticated as ${req.username}.`
      : `You are not authenticated.`;

    res.send(auth);
  }
);

module.exports = app;
