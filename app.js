const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const menus = require("./public/js/menus");
const { json } = require("body-parser");
// const ejs = require("ejs");
// const _ = require('lodash');
const mongoose = require("mongoose");
require("dotenv").config();
//for connct atlas
// const dbURL = process.env.MONGODB_URL;

//for connect local
const dbURL =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0";

const app = express();
const port = 3000;

mongoose
  .connect(dbURL)
  .then(() => console.log("Connected!"))
  .catch(() => console.log("Something went wrong with DB"));


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

  res.render("index");
});

app.listen(process.env.PORT, function () {
  console.log(`Server app listening on port ${port}`);

});
