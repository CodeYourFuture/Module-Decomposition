
function parseJsonArrayBody(req, res, next) {
  let data = "";

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    try {
      const parsed = JSON.parse(data);

      if (!Array.isArray(parsed)) {
        return res.status(400).send("Body must be array");
      }

      const allStrings = parsed.every(
        (item) => typeof item === "string"
      );

      if (!allStrings) {
        return res.status(400).send("Must contain strings");
      }

      req.body = parsed;
      next();

    } catch {
      res.status(400).send("Invalid JSON");
    }
  });
}
module.exports = parseJsonArrayBody;