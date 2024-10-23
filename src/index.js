require("dotenv").config();
const { dbConnect } = require("./Database/DBconnect.js");

dbConnect();
