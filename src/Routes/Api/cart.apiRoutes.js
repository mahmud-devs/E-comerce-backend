const express = require("express");
const _ = express.Router();
const { authGuard } = require("../../middleware/authGuard");
const {
  addToCart,
  getCartItemuser,
} = require("../../Controller/cart.controller");

_.route("/addToCart").post(authGuard, addToCart);
_.route("/getUserItem").get(authGuard, getCartItemuser);

module.exports = _;
