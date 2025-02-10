const express = require("express");
const _ = express.Router();
const { authGuard } = require("../../middleware/authGuard");
const {
  addToCart,
  getCartItemuser,
  incrementCartItem,
  decrementCartItem,
  userCart,
  deleteCartItem,
} = require("../../Controller/cart.controller");

_.route("/addToCart").post(authGuard, addToCart);
_.route("/getUserItem").get(authGuard, getCartItemuser);

_.route("/increment").post(authGuard, incrementCartItem);
_.route("/decrement").post(authGuard, decrementCartItem);

_.route("/userCartItem").get(authGuard, userCart);

_.route("/deleteCartItem").delete(authGuard, deleteCartItem);

module.exports = _;
