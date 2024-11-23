const express = require("express");
const _ = express.Router();

const {
  creatProduct,
  updateProduct,
} = require("../../Controller/product.controller");
const { upload } = require("../../middleware/multer.middleware");

_.route("/product").post(
  upload.fields([{ name: "image", maxCount: 10 }]),
  creatProduct
);

_.route("/product/:productId").put(
  upload.fields([{ name: "image", maxCount: 10 }]),
  updateProduct
);

module.exports = _;
