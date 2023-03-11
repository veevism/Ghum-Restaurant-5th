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

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/admin_login", (req, res) => {
  res.render("admin_login");
});

app.get("/admin", (req, res) => {
  res.render("admin");
});

//404 handling
app.use((req, res, next) => {
  res.status(404).catch(res.redirect("/"))
});

// console.log(new Error('A standard error'))

// console.log("mmm",menus.menu[3])


app.listen(process.env.PORT, function () {
  console.log(`Server app listening on port ${port}`);

});
