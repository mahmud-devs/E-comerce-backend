const express = require("express");
const app = express();
const AllRoutes = require("./Routes/index.js");

app.use( AllRoutes);


module.exports = { app };
