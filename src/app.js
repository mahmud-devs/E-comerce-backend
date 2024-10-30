const express = require("express");
const app = express();
const AllRoutes = require("./Routes/index.js");

// ====== using middleware

app.use(express.json());

app.use(AllRoutes);

module.exports = { app };
