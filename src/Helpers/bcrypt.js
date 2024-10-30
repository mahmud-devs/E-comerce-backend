const bcrypt = require("bcrypt");
const makeHashPassword = async (plainPassword) => {
  try {
    return await bcrypt.hash(plainPassword, 10);
  } catch (error) {
    console.log("error from bcrypt hash password", error);
  }
};

module.exports = { makeHashPassword };
