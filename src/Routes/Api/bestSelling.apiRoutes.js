const express = require("express");
const _ = express.Router();

const {
  createBestSelling,
  getAllBestSelling,
  editBestSelling,
  deleteBestSelling,
} = require("../../Controller/bestSelling.controller");

_.route("/bestSelling").post(createBestSelling).get(getAllBestSelling);

_.route("/bestSelling/:id").put(editBestSelling).delete(deleteBestSelling);

module.exports = _;
