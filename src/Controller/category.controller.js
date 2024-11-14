const categoryModel = require("../Model/category.model.js");
const { apiResponce } = require("../Utils/ApiResponce.js");
const { apiError } = require("../Utils/ApiError.js");

/**
 * todo: make createCategory controller
 * @perams({req,res})
 */

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(401)
        .json(
          new apiError(false, 401, null, `category credential missing`, true)
        );
    }

    // =========== check if upcoming category is alreay in use
    const isExistCategory = await categoryModel.find({ name: name });

    if (isExistCategory?.length) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            `${name} category already exists `,
            true
          )
        );
    }

    // ======= now save the data in database

    const saveCategory = await categoryModel.create({
      name,
      description,
    });

    if (!saveCategory) {
      return res
        .status(501)
        .json(
          new apiError(false, 501, null, `failed to create category`, true)
        );
    }
    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          saveCategory,
          `category created successfully`,
          false
        )
      );

    // ===============================
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from creat category controller ${error}`,
          true
        )
      );
  }
};

// =========  get all categories

const getAllCategory = async (req, res) => {
  try {
    const allCategory = await categoryModel.find({});
    if (!allCategory?.length) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, `category not found `, true));
    }
    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          allCategory,
          `category fetch successfully`,
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
          `error from get all category controller ${error}`,
          true
        )
      );
  }
};

// ============ get single category

const getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const singleCategory = await categoryModel.findById({ _id: id });

    if (!singleCategory) {
      return res
        .status(501)
        .json(new apiError(false, 501, null, `category not found !! `, true));
    }

    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          singleCategory,
          `single category fetch successfully !! `,
          false
        )
      );
    // ======================
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from get single category controller ${error}`,
          true
        )
      );
  }
};

// ============ category update ==========

const updateSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const updateCategory = await categoryModel.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );

    if (updateCategory) {
      return res
        .status(200)
        .json(
          new apiResponce(
            true,
            200,
            updateCategory,
            `category updated successfully !! `,
            false
          )
        );
    }
    return res
      .status(501)
      .json(
        new apiError(false, 501, null, `failed to update category !! `, true)
      );

    // =================
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from update category controller ${error}`,
          true
        )
      );
  }
};

module.exports = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateSingleCategory,
};
