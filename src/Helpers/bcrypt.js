const bcrypt = require("bcrypt");
const makeHashPassword = async (plainPassword) => {
  try {
    return await bcrypt.hash(plainPassword, 10);
  } catch (error) {
    console.log(`error from bcrypt hash password ${error}`);
  }
};

// =========== compare password========

const comparePassword = async (plainPassword, hashPassword) => {
  try {
    return bcrypt.compare(plainPassword, hashPassword);
  } catch (error) {
    console.log(`faild to compare password ${error}`);
  }
};

module.exports = { makeHashPassword, comparePassword };
