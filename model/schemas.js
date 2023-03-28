const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  firstName: String,
  lastName: String,
  address: {
    name: String,
    location: {
      address: String,
      subDistrict: String,
      district: String,
      province: String,
      country: String,
      zip: Number,
    },
  },
});

userSchema.plugin(passportLocalMongoose);
const menuSchema = new mongoose.Schema({
  _id: Number,
  title: String,
  category: String,
  price: mongoose.Types.Decimal128,
  img: String,
  desc: String,
  quantity: Number,
});

const order_detailSchema = new mongoose.Schema({
  user_id: Number,
  paid_status: String,
  order_status: String,
  delivery_status: String,
  payment_method: String,
  items_id: Number,
});

const itemSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  cart: {
    menu_id: Number,
    quantity: Number,
  },
});

exports.Item = mongoose.model("Item", itemSchema);

exports.Order_details = new mongoose.model("Order_details", order_detailSchema);

exports.Menu = mongoose.model("Menu", menuSchema);

exports.User = new mongoose.model("User", userSchema);
