const { apiResponce } = require("../Utils/ApiResponce.js");
const { apiError } = require("../Utils/ApiError.js");

const productModel = require("../Model/product.model.js");
const { StaticFileGenerator } = require("../Helpers/staticFileGenerator.js");

// ================ create product ======================

const creatProduct = async (req, res) => {
  try {
    const { name, description, price, category, subcategory } = req.body;
    if (!name || !description || !price || !subcategory || !category) {
      return res
        .status(401)
        .json(
          new apiError(false, 401, null, `product credential missing `, true)
        );
    }

    if (!req.files) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            `product image credential missing `,
            true
          )
        );
    }
    const allImage = req.files?.image;

    const allImageWitthDomain = StaticFileGenerator(allImage);

    const isExistProduce = await productModel.find({ name: name });

    if (isExistProduce?.length) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, `product already exist ok`, true));
    }

    const saveProduct = await productModel.create({
      name,
      description,
      price,
      category,
      subcategory,
      image: allImageWitthDomain,
    });
    if (saveProduct) {
      return res
        .status(200)
        .json(
          new apiResponce(
            true,
            200,
            saveProduct,
            `product created successfully `,
            false
          )
        );
    }
    return res
      .status(501)
      .json(new apiError(false, 501, null, `failed to create product `, true));
    // =====================
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `error from create product controller ${error}`,
          true
        )
      );
  }
};

module.exports = { creatProduct };
