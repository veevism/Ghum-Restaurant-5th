const mongoose = require("mongoose");
// const db = require("../config/db");

const menuSchema = new mongoose.Schema({
  _id: Number,
  title: String,
  category: String,
  price: mongoose.Types.Decimal128,
  img: String,
  desc: String,
  quantity: Number,
});

exports.Menu = mongoose.model("menu", menuSchema);
