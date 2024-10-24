const mongoose = require("mongoose");
const chalk = require("chalk");
const { DbName } = require("../Constant/constant.js");
const dbConnect = async () => {
  try {
    const databaseInstence = await mongoose.connect(
      `${process.env.MONGODB_DATABASE_URL}/${DbName}`
    );
    if (databaseInstence) {
      console.log(
        chalk.bgYellow(
          "database connection successfully",
          databaseInstence.connection.host
        )
      );
    }
  } catch (error) {
    console.log("database connection error", error);
  }
};

module.exports = { dbConnect };
