const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const menus = require("./public/js/menus");
const { json } = require("body-parser");
// const ejs = require("ejs");
// const _ = require('lodash');

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/js", express.static(__dirname + "controller"));

app.get("/", (req, res) => {
  res.render("index", {
    menus: menus,
  });
});

// console.log("mmm",menus.menu[3])

app.listen(port, function () {
  console.log(`Server app listening on port ${port}`);
  console.log("http://localhost:3000/");
});
