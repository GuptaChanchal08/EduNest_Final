const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Razorpay = require("razorpay");

exports.instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});
