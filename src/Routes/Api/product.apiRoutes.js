const express = require("express");
const _ = express.Router();

const {
  creatProduct,
  updateProduct,
  getAllProduct,
  getSingleProduct,
  deleteProduct,
} = require("../../Controller/product.controller");
const { upload } = require("../../middleware/multer.middleware");

_.route("/product")
  .post(upload.fields([{ name: "image", maxCount: 10 }]), creatProduct)
  .get(getAllProduct);

_.route("/product/:productId")
  .put(upload.fields([{ name: "image", maxCount: 10 }]), updateProduct)
  .get(getSingleProduct).delete(deleteProduct)



module.exports = _;
