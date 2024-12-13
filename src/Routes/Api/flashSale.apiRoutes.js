const express = require("express");
const _ = express.Router();

const {
  createFlashSale,
  getAllFlashSale,
  editFlashSale,
  deleteFlashSale,
} = require("../../Controller/flashSale.controller");

_.route("/flashSale").post(createFlashSale).get(getAllFlashSale);

_.route("/flashSale/:id").put(editFlashSale).delete(deleteFlashSale);

module.exports = _;
