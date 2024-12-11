const express = require("express");
const app = express();
const AllRoutes = require("./Routes/index.js");
const cookieParser = require("cookie-parser");

const cors = require("cors");

// ====== using middleware
app.use(cors());

app.use(cookieParser());

app.use(express.json());

app.use(express.static("Public/temp"));

app.use(AllRoutes);

module.exports = { app };
