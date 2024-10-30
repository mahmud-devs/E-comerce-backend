const express = require("express");
const _ = express.Router();
const {
  Registration,
  verifyOtp,
} = require("../../Controller/auth.controler.js");
_.route("/auth/registration").post(Registration);
_.route("/auth/verify-otp").post(verifyOtp);

module.exports = _;
