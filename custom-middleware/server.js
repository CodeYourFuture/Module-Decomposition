import express from "express";

const app = express();

const authenticate = (req, res, next) => {
  if (req.headers["X-Username"]) {
    req.username = req.headers["X-Username"];
  } else {
    req.username = null;
  }
  next();
};
