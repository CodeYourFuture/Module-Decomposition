import express from "express";
const app = express();
const checkUsername = (req, res, next) => {
  req.username = req.get("X-Username") ?? null;
  next();
};
const validateBody = (req,res,next)=>{
  if (!Array.isArray(req.body)) {
    return res.status(400).send("Expected body to be an array.");
  }
  const allString = req.body.every((item) => typeof item === "string");
  if (!allString) {
   return res.status(400).send("Expected all array elements to be strings.");
  
  }
  next();
}
app.use(checkUsername);
app.use(express.json());
app.use(validateBody);

app.post("/", (req, res) => {
 
  let response = "";
  if (req.username) {
    response += `You are authenticated as ${req.username}.`;
  } else {
    response += `You are not authenticated.`;
  }
  const count = req.body.length;
  const subjectWord = count === 1 ? "subject" : "subjects";
  response += `\n\nYou have requested information about ${count} ${subjectWord}`;
  if (count > 0) {
    response += `: ${req.body.join(", ")}`;
  }
  response += ".";
  res.send(response);
});
app.listen(3000, () => {
  console.log("Server listening on the port 3000");
});
