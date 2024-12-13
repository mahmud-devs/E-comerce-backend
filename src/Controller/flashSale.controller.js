const { apiResponce } = require("../Utils/ApiResponce.js");
const { apiError } = require("../Utils/ApiError.js");

const flashSaleModel = require("../Model/flashSale.model.js");

// =============== create flashsale ==================

const createFlashSale = async (req, res) => {
  try {
    const { product } = req.body;
    const isExistFlashSale = await flashSaleModel.findOne({ product: product });
    if (isExistFlashSale) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            `flashSale product already exist ok`,
            true
          )
        );
    }
    const saveFlashSale = await flashSaleModel.create({
      product: product,
    });
    if (!saveFlashSale) {
      return res
        .status(501)
        .json(
          new apiError(
            false,
            501,
            null,
            `failed to create flash sale product`,
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
          saveFlashSale,
          `flashSale product created successfully `,
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
          `error from create flashSale controller ${error}`,
          true
        )
      );
  }
};

// ============== get all flash sale ==============

const getAllFlashSale = async (req, res) => {
  try {
    const fetchAllFlashSale = await flashSaleModel.find().populate("product");
    if (!fetchAllFlashSale?.length) {
      return res
        .status(501)
        .json(
          new apiError(
            false,
            501,
            null,
            `failed to fetch all flash sale product`,
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
          fetchAllFlashSale,
          `fetch all flashSale products successfully `,
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
          `error from get All flashSale product controller ${error}`,
          true
        )
      );
  }
};

// ================= edit flashSale product ====================

const editFlashSale = async (req, res) => {
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
            `flashSale id missing from params`,
            true
          )
        );
    }
    const findFlashSale = await flashSaleModel
      .findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true })
      .populate("product");

    if (!findFlashSale) {
      return res
        .status(501)
        .json(
          new apiError(false, 501, null, `failed to update flashSale`, true)
        );
    }
    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          findFlashSale,
          `flashSale product successfully `,
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
          `error from edit flashSale product controller ${error}`,
          true
        )
      );
  }
};

// =================== delete flashSale product ================

const deleteFlashSale = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteFlashSaleProduct = await flashSaleModel
      .findByIdAndDelete({
        _id: id,
      })
      .populate("product");
    if (!deleteFlashSaleProduct) {
      return res
        .status(501)
        .json(
          new apiError(false, 501, null, `failed to delete flashSale`, true)
        );
    }
    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          deleteFlashSaleProduct,
          `flashSale product deleted successfully `,
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
          `error from delete flashSale product controller ${error}`,
          true
        )
      );
  }
};
module.exports = {
  createFlashSale,
  getAllFlashSale,
  editFlashSale,
  deleteFlashSale,
};
