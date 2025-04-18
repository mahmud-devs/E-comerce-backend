const express = require("express");

const _ = express.Router();
const authApiRoutes = require("./Api/auth.apiroutes.js");
const categoryApiRoutes = require("./Api/category.apiRoutes.js");
const subcategoryApiRoutes = require("./Api/subcategory.apiRoutes.js");
const productApiRoutes = require("./Api/product.apiRoutes.js");
const bannerApiRoutes = require("./Api/banner.apiRoutes.js");
const flashSaleApiRoutes = require("./Api/flashSale.apiRoutes.js");
const bestSellingApiRoutes = require("./Api/bestSelling.apiRoutes.js");
const newArrivalApiRoutes = require("./Api/newArrival.apiRoutes.js");
const contactApiRoutes = require("./Api/contact.apiRoutes.js");
const cartApiRoutes = require("./Api/cart.apiRoutes.js");
const orderApiRoutes = require("./Api/order.apiRoutes.js");
const paymentApiRoutes = require("./Api/payment.apiroutes.js");
const baseApi = process.env.BASE_API;
// ====== using middleware =============
_.use(baseApi, authApiRoutes);
_.use(baseApi, categoryApiRoutes);
_.use(baseApi, subcategoryApiRoutes);
_.use(baseApi, productApiRoutes);
_.use(baseApi, bannerApiRoutes);
_.use(baseApi, flashSaleApiRoutes);
_.use(baseApi, bestSellingApiRoutes);
_.use(baseApi, newArrivalApiRoutes);
_.use(baseApi, contactApiRoutes);
_.use(baseApi, cartApiRoutes);
_.use(baseApi, orderApiRoutes);
_.use(baseApi, paymentApiRoutes);

_.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    data: null,
    messege: "your route is invalid",
    error: true,
  });
});

module.exports = _;
