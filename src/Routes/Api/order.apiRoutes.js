const express = require("express");
const _ = express.Router();
const { authGuard } = require("../../middleware/authGuard");
const { placeorder } = require("../../Controller/order.controller");
_.route("/placeorder").post(authGuard, placeorder);

module.exports = _;
