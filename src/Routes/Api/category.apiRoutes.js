const express = require("express");
const _ = express.Router();

const {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateSingleCategory,
  deleteCategory,
} = require("../../Controller/category.controller");
const { upload } = require("../../middleware/multer.middleware");

_.route("/category")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), createCategory)
  .get(getAllCategory);
_.route("/category/:id")
  .get(getSingleCategory)
  .put(upload.fields([{ name: "image", maxCount: 1 }]), updateSingleCategory)
  .delete(deleteCategory);

module.exports = _;
