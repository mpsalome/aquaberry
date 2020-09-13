const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const PORT = process.env.PORT || 8080;

const app = express();

app.use("/", serveStatic(path.join(__dirname, "/dist")));

app.get(/.*/, function(req, res) {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

app.listen(PORT, () => console.log(`The Magic Happens on Port -> ${PORT}`));