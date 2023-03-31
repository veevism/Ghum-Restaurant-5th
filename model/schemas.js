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
      zip: Number
    },
  }
});

userSchema.plugin(passportLocalMongoose);

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

adminSchema.plugin(passportLocalMongoose);

const menuSchema = new mongoose.Schema({
  _id: Number,
  title: String,
  category: String,
  price: mongoose.Types.Decimal128,
  img: String,
  desc: String,
  quantity: Number,
});

exports.Menu = mongoose.model("Menu", menuSchema);

exports.User = new mongoose.model("User", userSchema);

exports.Admin = new mongoose.model("Admin", adminSchema);

// New schema

const carts = new mongoose.Schema({
  userId: String, // Reference to the user who owns the cart
  items: [
    {
      itemId: String,
      quantity: Number,
    },
  ],
});

const orders = new mongoose.Schema({
  userId: String, // Reference to the user who placed the order
  items: [
    {
      itemId: String, // Reference to the item
      quantity: Number,
      price: Number, // Store price at the time of the order to handle price changes
    },
    // ... more items
  ],
  orderDate: Date,
  status: String, // e.g., 'Processing', 'Shipped', 'Delivered', 'Canceled'
});

exports.Cart = new mongoose.model("Cart", carts);

exports.Order = new mongoose.model("Order", orders);