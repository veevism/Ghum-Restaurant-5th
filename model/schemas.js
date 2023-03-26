const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    firstName: String,
    lastName: String,
    address: String
});

userSchema.plugin(passportLocalMongoose);

exports.User = new mongoose.model("User", userSchema);