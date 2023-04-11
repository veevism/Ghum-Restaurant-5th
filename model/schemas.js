const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  firstName: String,
  lastName: String,
  address: {
    name: { type: String, default: '' },
    location: {
      address: { type: String, default: '' },
      subDistrict: { type: String, default: '' },
      district: { type: String, default: '' },
      province: { type: String, default: '' },
      country: { type: String, default: '' },
      zip: { type: Number, default: null },
    },
  }
});

userSchema.plugin(passportLocalMongoose);

exports.User = new mongoose.model("User", userSchema);

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

adminSchema.plugin(passportLocalMongoose);

exports.Admin = new mongoose.model("Admin", adminSchema);

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

const carts = new mongoose.Schema({
  userId: String, // Reference to the user who owns the cart
  items: [
    {
      itemId: String,
      quantity: Number,
    },
  ],
});

exports.Cart = new mongoose.model("Cart", carts);

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

exports.Order = new mongoose.model("Order", orders);

const categorySchema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
});

exports.Category = mongoose.model("Category", categorySchema);