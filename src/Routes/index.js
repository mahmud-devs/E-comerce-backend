const express = require("express");

const _ = express.Router();
const authApiRoutes = require("./Api/auth.apiroutes.js");
const categoryApiRoutes = require("./Api/category.apiRoutes.js");
const subcategoryApiRoutes = require("./Api/subcategory.apiRoutes.js");
const productApiRoutes = require("./Api/product.apiRoutes.js");
const baseApi = process.env.BASE_API;
// ====== using middleware =============
_.use(baseApi, authApiRoutes);
_.use(baseApi, categoryApiRoutes);
_.use(baseApi, subcategoryApiRoutes);
_.use(baseApi, productApiRoutes);

_.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    data: null,
    messege: "your route is invalid",
    error: true,
  });
});

module.exports = _;
