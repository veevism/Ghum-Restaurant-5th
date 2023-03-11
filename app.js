const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const menus = require("./public/js/menus");
const { json } = require("body-parser");
const db = require("./config/db");
// const ejs = require("ejs");
// const _ = require('lodash');
require("dotenv").config();

db.connect();

//for connct atlas
// const dbURL = process.env.MONGODB_URL;

//for connect local

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

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/admin_login", (req, res) => {
  res.render("admin_login");
});

app.get("/admin", (req, res) => {
  res.render("admin");
});

app.get("/checkout", (req, res) => {
  res.render("checkout");
});

//404 handling
app.use((req, res, next) => {
  res.status(404).catch(res.redirect("/"));
});

// console.log(new Error('A standard error'))

// console.log("mmm",menus.menu[3])

app.listen(process.env.PORT, function () {
  console.log(`Server app listening on port ${process.env.PORT}`);
});
