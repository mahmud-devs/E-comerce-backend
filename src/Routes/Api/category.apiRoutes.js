const express = require("express");
const _ = express.Router();

const {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateSingleCategory,
} = require("../../Controller/category.controller");

_.route("/category").post(createCategory).get(getAllCategory);
_.route("/category/:id").get(getSingleCategory).patch(updateSingleCategory);

module.exports = _;
