const { apiResponce } = require("../Utils/ApiResponce.js");
const { apiError } = require("../Utils/ApiError.js");
const subcategoryModel = require("../Model/subcategory.model.js");

// =========== create subcategory==========

const createSubcategory = async (req, res) => {
  try {
    for (let key in req.body) {
      if (!req.body[key]) {
        return res
          .status(401)
          .json(
            new apiError(false, 401, null, `${key} credential missing`, true)
          );
      }
    }

    const alreadyExistSubcategory = await subcategoryModel.find({
      name: req.body.name,
    });

    if (alreadyExistSubcategory?.length) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            `subcategory already exists in database`,
            true
          )
        );
    }
    // ========= save in database

    const saveSubcategory = await subcategoryModel.create({ ...req.body });
    if (saveSubcategory) {
      return res
        .status(200)
        .json(
          new apiResponce(
            true,
            200,
            saveSubcategory,
            `Subcategory created successfully `,
            false
          )
        );
    }
    return res
      .status(501)
      .json(
        new apiError(false, 501, null, `failed to create subcategory`, true)
      );

    // ================
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from create subcategory controller ${error}`,
          true
        )
      );
  }
};

// ============ get all subcategory

const getAllSubcategory = async (req, res) => {
  try {
    const getSubcategory = await subcategoryModel.find().populate("category");
    if (getSubcategory?.length) {
      return res
        .status(200)
        .json(
          new apiResponce(
            true,
            200,
            getSubcategory,
            `all Subcategory fetch successfully  `,
            false
          )
        );
    }
    return res
      .status(501)
      .json(
        new apiError(false, 501, null, `failed to fetch all subcategory `, true)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from get all subcategory controller ${error}`,
          true
        )
      );
  }
};

// ========= get single subcategory

const getSingleSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const singleSubcategory = await subcategoryModel
      .findById(id)
      .populate("category");

    if (singleSubcategory) {
      return res
        .status(200)
        .json(
          new apiResponce(
            true,
            200,
            singleSubcategory,
            `single Subcategory fetch successfully `,
            false
          )
        );
    }
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `failed to fetch single subcategory`,
          true
        )
      );

    // =======================
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from get single subcategory controller ${error}`,
          true
        )
      );
  }
};

// ============ delete subcategory

const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteSingleSubcategory = await subcategoryModel
      .findOneAndDelete({
        _id: id,
      })
      .populate("category");
    if (deleteSingleSubcategory) {
      return res
        .status(200)
        .json(
          new apiResponce(
            true,
            200,
            deleteSingleSubcategory,
            `Subcategory deleted successfully `,
            false
          )
        );
    }
    return res
      .status(501)
      .json(
        new apiError(false, 501, null, `failed to delete subcategory`, true)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from delete subcategory controller ${error}`,
          true
        )
      );
  }
};

// ============ edit subcategory
const UpdateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const UpdateSingleSubcategory = await subcategoryModel
      .findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true })
      .populate("category");
    if (UpdateSingleSubcategory) {
      return res
        .status(200)
        .json(
          new apiResponce(
            true,
            200,
            UpdateSingleSubcategory,
            `Subcategory updated successfully `,
            false
          )
        );
    }
    return res
      .status(501)
      .json(
        new apiError(false, 501, null, `failed to update subcategory`, true)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from edit subcategory controller ${error}`,
          true
        )
      );
  }
};

module.exports = {
  createSubcategory,
  getAllSubcategory,
  getSingleSubcategory,
  deleteSubcategory,
  UpdateSubcategory,
};
