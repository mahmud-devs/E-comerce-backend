const express = require("express");
const _ = express.Router();

const {
  creatBanner,
  getBanner,
  getSingleBanner,
  updateSingleBanner,
  deleteBanner,
} = require("../../Controller/banner.controller");
const { upload } = require("../../middleware/multer.middleware");
_.route("/banner")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), creatBanner)
  .get(getBanner);

_.route("/banner/:bannerId")
  .get(getSingleBanner)
  .put(upload.fields([{ name: "image", maxCount: 1 }]), updateSingleBanner)
  .delete(deleteBanner);

module.exports = _;
