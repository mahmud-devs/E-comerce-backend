const express = require("express");
const _ = express.Router();
const { authGuard } = require("../../middleware/authGuard");
const {
  placeorder,
  getAllOrders,
  deleteOrder,
  getSingleOrder,
  updateOrderStatus,
} = require("../../Controller/order.controller");
_.route("/placeorder").post(authGuard, placeorder);
_.route("/allOrder").get(getAllOrders);
_.route("/order/:orderId").delete(deleteOrder).get(getSingleOrder).put(updateOrderStatus)

module.exports = _;
