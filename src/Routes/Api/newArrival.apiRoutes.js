const express = require("express");
const _ = express.Router();

const {
  createNewArrivals,
  getNewArrival,
  updateNewArrival,
  deleteNewArrival,
} = require("../../Controller/newArrivals.controller");

_.route("/newArrivals").post(createNewArrivals).get(getNewArrival);

_.route("/newArrivals/:id").put(updateNewArrival).delete(deleteNewArrival);

module.exports = _;
