const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const menus = require("./public/js/menus");
const { json } = require("body-parser");
const db = require("./config/db");

const { Menu } = require("./model/schema");
// const ejs = require("ejs");
// const _ = require('lodash');

require("dotenv").config();
db.connect();
//for connct atlas
// const dbURL = process.env.MONGODB_URL;
let menuObjList = [];
//for connect local
for (let i = 0; i < 10; i++) {
  console.log("hh");

  menuObjList.push(
    new Menu({
      _id: menus.menu[i].id,
      title: menus.menu[i].title,
      category: menus.menu[i].category,
      price: menus.menu[i].price,
      img: menus.menu[i].img,
      desc: menus.menu[i].desc,
      quantity: menus.menu[i].quantity,
    })
  );
}

Menu.collection
  .insertMany(menuObjList)
  .then(() => {
    "Menu has been successfully added to DB";
  })
  .catch(() => {
    "Menu already been in DB";
  });

// const special1 = new Menu({
//   id: 2,
//   title: "Hellossss",
//   price: 64.2,
// });

// Menu.collection.insertOne(special1);
// Menu.collection.insertOne(special1).then(() => console.log("add 1 items"));
const app = express();
const port = 3000;

// console.log(Menus.find(special1));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));
// app.use("/js", express.static(__dirname + "controller"));

//vvadded
app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
  res.render("index", {
    menus: menus,
  });

  const menuDBLength = (await Menu.find({})).length;
  console.log(menuDBLength);
  // console.log((await menuss).length);
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

app.get("/payment", (req, res) => {
  res.render("payment");
});

app.get("/status", (req, res) => {
  res.render("status");
});

//404 handling
// app.use((req, res, next) => {
//   res.status(404).catch(res.redirect("/"));
// });

// console.log(new Error('A standard error'))

// console.log("mmm",menus.menu[3])

app.listen(process.env.PORT, function () {
  console.log(`Server app listening on port ${process.env.PORT}`);
});
