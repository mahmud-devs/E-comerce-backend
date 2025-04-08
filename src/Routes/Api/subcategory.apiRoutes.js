const express = require("express");
const _ = express.Router();
const {
  createSubcategory,
  getAllSubcategory,
  getSingleSubcategory,
  deleteSubcategory,
  UpdateSubcategory,
} = require("../../Controller/subcategory.controller");

_.route("/subcategory").post(createSubcategory).get(getAllSubcategory);
_.route("/subcategory/:id")
  .get(getSingleSubcategory)
  .delete(deleteSubcategory)
  .put(UpdateSubcategory);

module.exports = _;
