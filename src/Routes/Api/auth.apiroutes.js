const express = require("express");
const _ = express.Router();
const {
  Registration,
  verifyOtp,
  login,
  logout,
  resetPassword,
  resetEmail,
  recoveryEmail,
  resendOtp,
} = require("../../Controller/auth.controller.js");
const { authGuard } = require("../../middleware/authGuard.js");
_.route("/auth/registration").post(Registration);
_.route("/auth/verify-otp").post(verifyOtp);
_.route("/auth/resend-otp").post(resendOtp);
_.route("/auth/login").post(login);
_.route("/auth/logout").get(authGuard, logout);
_.route("/auth/reset-Password").post(resetPassword);
_.route("/auth/reset-Email").post(resetEmail);
_.route("/auth/recovery-Email").post(authGuard, recoveryEmail);

module.exports = _;
