const { apiResponce } = require("../Utils/ApiResponce.js");
const { apiError } = require("../Utils/ApiError.js");
const Registration = async (req, res) => {
  try {
    res
      .status(200)
      .json(new apiResponce(true, null, "api responce working", false));
  } catch (error) {
    return res
      .status(501)
      .json(new apiError(false, null, "api responce error" , true));
  }
};

module.exports = { Registration };
