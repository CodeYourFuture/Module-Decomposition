import express from "express"
const app = express();
const port = 3000;

function usernameExtract(req, res, next) {
  const username = req.get("X-Username");
  req.username = username ? username : null;
  next();
}

