const express = require("express");
const _ = express.Router();
const { authGuard } = require("../../middleware/authGuard");
const {
  placeorder,
  getAllOrders,
} = require("../../Controller/order.controller");
_.route("/placeorder").post(authGuard, placeorder);
_.route("/allOrder").get(getAllOrders);

module.exports = _;
