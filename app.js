const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const menu = require("./scripts/menus");
// const ejs = require("ejs");
// const _ = require('lodash');

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/js", express.static(__dirname + "controller"));

console.log(menu);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, function () {
  console.log(`Server app listening on port ${port}`);
  console.log("http://localhost:3000/");
});
