const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const databaseInstence = await mongoose.connect(
      process.env.MONGODB_DATABASE_URL
    );
    if (databaseInstence) {
      console.log(
        "database connection successfully",
        databaseInstence.connection.host
      );
    }
  } catch (error) {
    console.log("database connection error", error);
  }
};

module.exports = { dbConnect };
