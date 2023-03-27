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
