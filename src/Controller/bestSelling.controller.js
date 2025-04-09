const { apiResponce } = require("../Utils/ApiResponce.js");
const { apiError } = require("../Utils/ApiError.js");

const bestSellingModel = require("../Model/bestSelling.model.js");

// =============== create bestSelling ==================

const createBestSelling = async (req, res) => {
  try {
    const { product } = req.body;

   
    const isExistbestSelling = await bestSellingModel.findOne({
      product: product,
    });
    if (isExistbestSelling) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            `bestSelling product already exist ok`,
            true
          )
        );
    }
    
    const savebestSelling = await bestSellingModel.create({
      product: product,
    });
    if (!savebestSelling) {
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
          savebestSelling,
          `bestSelling product created successfully `,
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
          `error from create bestSelling controller ${error}`,
          true
        )
      );
  }
};

// ============== get all flash sale ==============

const getAllBestSelling = async (req, res) => {
  try {
    const fetchAllbestSelling = await bestSellingModel.find().populate({
      path: "product",
      populate: {
        path: "category", // Populating the category inside the product
      },
    });

    if (!fetchAllbestSelling?.length) {
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
          fetchAllbestSelling,
          `fetch all bestSelling products successfully `,
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
          `error from get All bestSelling product controller ${error}`,
          true
        )
      );
  }
};

// ================= edit bestSelling product ====================

const editBestSelling = async (req, res) => {
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
            `bestSelling id missing from params`,
            true
          )
        );
    }
    const findbestSelling = await bestSellingModel
      .findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true })
      .populate("product");

    if (!findbestSelling) {
      return res
        .status(501)
        .json(
          new apiError(false, 501, null, `failed to update bestSelling`, true)
        );
    }
    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          findbestSelling,
          `bestSelling product successfully `,
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
          `error from edit bestSelling product controller ${error}`,
          true
        )
      );
  }
};

// =================== delete bestSelling product ================

const deleteBestSelling = async (req, res) => {
  try {
    const { id } = req.params;
    const deletebestSellingProduct = await bestSellingModel
      .findByIdAndDelete({
        _id: id,
      })
      .populate("product");
    if (!deletebestSellingProduct) {
      return res
        .status(501)
        .json(
          new apiError(false, 501, null, `failed to delete bestSelling`, true)
        );
    }
    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          deletebestSellingProduct,
          `bestSelling product deleted successfully `,
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
          `error from delete bestSelling product controller ${error}`,
          true
        )
      );
  }
};
module.exports = {
  createBestSelling,
  getAllBestSelling,
  editBestSelling,
  deleteBestSelling,
};
