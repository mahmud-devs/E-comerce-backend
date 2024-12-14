const { apiResponce } = require("../Utils/ApiResponce.js");
const { apiError } = require("../Utils/ApiError.js");

const newArrivalsModel = require("../Model/newArrivals.model.js");

// =============== create newArrivals ===================

const createNewArrivals = async (req, res) => {
  try {
    const { product } = req.body;
    const isExistNewArrivals = await newArrivalsModel.findOne({
      product: product,
    });
    if (isExistNewArrivals) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            `newArrivals product already exist ok`,
            true
          )
        );
    }

    const saveNewArrivals = await newArrivalsModel.create({ product: product });

    if (!saveNewArrivals) {
      return res
        .status(501)
        .json(
          new apiError(
            false,
            501,
            null,
            `failed to create newArrivals product`,
            true
          )
        );
    }

    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          saveNewArrivals,
          `newArrivals product created successfully `,
          false
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from create newArrival controller ${error}`,
          true
        )
      );
  }
};

// ================= get all newArrivals =====================

const getNewArrival = async (req, res) => {
  try {
    const fetchNewArrival = await newArrivalsModel.find().populate("product");
    if (!fetchNewArrival?.length) {
      return res
        .status(501)
        .json(
          new apiError(
            false,
            501,
            null,
            `failed to fetch all newArrivals product`,
            true
          )
        );
    }
    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          fetchNewArrival,
          `fetch all newArrivals products successfully `,
          false
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from get All newArrivals product controller ${error}`,
          true
        )
      );
  }
};

// =================== update NewArrivals =======================

const updateNewArrival = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            `newArrivals id missing from params`,
            true
          )
        );
    }
    const findNewArrival = await newArrivalsModel
      .findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true })
      .populate("product");

    if (!findNewArrival) {
      return res
        .status(501)
        .json(
          new apiError(false, 501, null, `failed to update newArrivals`, true)
        );
    }
    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          findNewArrival,
          `newArrivals product successfully updated`,
          false
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from update newArrivals product controller ${error}`,
          true
        )
      );
  }
};

// ======================== delete newArrivals ========================

const deleteNewArrival = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteNewArrivalProduct = await newArrivalsModel
      .findByIdAndDelete({
        _id: id,
      })
      .populate("product");
    if (!deleteNewArrivalProduct) {
      return res
        .status(501)
        .json(
          new apiError(false, 501, null, `failed to delete NewArrival`, true)
        );
    }
    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          deleteNewArrivalProduct,
          `NewArrival product deleted successfully `,
          false
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from delete NewArrival product controller ${error}`,
          true
        )
      );
  }
};

module.exports = {
  createNewArrivals,
  getNewArrival,
  updateNewArrival,
  deleteNewArrival,
};
