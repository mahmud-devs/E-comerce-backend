const express = require("express");
const app = express();
const AllRoutes = require("./Routes/index.js");
const cookieParser = require("cookie-parser");

// ====== using middleware
app.use(cookieParser());

app.use(express.json());

app.use(express.static("Public/temp"));

app.use(AllRoutes);

module.exports = { app };
