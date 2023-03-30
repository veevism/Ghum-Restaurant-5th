const mongoose = require("mongoose");
require("dotenv").config();
const dbURL = process.env.MONGODB_URL;
const dbLocalURL = "mongodb://127.0.0.1:27017/GhumDB";

exports.connect = () => {
  mongoose
    .connect(dbURL)
    .then(() => console.log("Connected!"))
    .catch(() => console.log("Something went wrong with DB"));
};
