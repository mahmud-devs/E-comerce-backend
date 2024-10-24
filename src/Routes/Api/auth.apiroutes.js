const express = require("express");
const _ = express.Router();
const { Registration } = require("../../Controller/auth.controler.js");
_.route("/registration").get(Registration);

module.exports = _;
