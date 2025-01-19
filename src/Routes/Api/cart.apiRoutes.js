const express = require("express");
const _ = express.Router();
const { authGuard } = require("../../middleware/authGuard");
const {
  addToCart,
  getCartItemuser,
  incrementCartItem,
  decrementCartItem,
  userCart,
} = require("../../Controller/cart.controller");

_.route("/addToCart").post(authGuard, addToCart);
_.route("/getUserItem").get(authGuard, getCartItemuser);

_.route("/increment/:cartid").post(authGuard, incrementCartItem);
_.route("/decrement/:cartid").post(authGuard, decrementCartItem);

_.route("/userCartItem").get(authGuard, userCart);

module.exports = _;
