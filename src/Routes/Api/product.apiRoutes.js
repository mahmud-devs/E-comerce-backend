const express = require("express");
const _ = express.Router();

const { creatProduct } = require("../../Controller/product.controller");
const { upload } = require("../../middleware/multer.middleware");

_.route("/product").post(
  upload.fields([{ name: "image", maxCount: 10 }]),
  creatProduct
);

module.exports = _;
