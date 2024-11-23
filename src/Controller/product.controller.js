const { apiResponce } = require("../Utils/ApiResponce.js");
const { apiError } = require("../Utils/ApiError.js");

const productModel = require("../Model/product.model.js");
const { StaticFileGenerator } = require("../Helpers/staticFileGenerator.js");
const {
  cloudnirayFileUpload,
  cloudinaryDeleteImage,
} = require("../Utils/cloudinary.js");

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

    let allUploadedImage = [];

    for (let imagePath of allImage) {
      let uploadFile = await cloudnirayFileUpload(imagePath?.path);
      allUploadedImage.push(uploadFile.secure_url);
    }

    // const allImageWitthDomain = StaticFileGenerator(allImage);

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
      image: allUploadedImage,
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

// ============== update product=====================

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const isExistProduct = await productModel.findById(productId);

    if (!isExistProduct) {
      return res
        .status(501)
        .json(new apiError(false, 501, null, `product does not exist`, true));
    }

    let deleteCloudinaryImage = null;
    let allUploadedImage = [];

    //================ if there is image while update
    if (req.files?.image) {
      // ============delete old image =========
      if (req.files?.image) {
        for (let image of isExistProduct.image) {
          const splitImage = image.split("/");
          const cloudinaryImageId =
            splitImage[splitImage.length - 1]?.split(".")[0];
          deleteCloudinaryImage =
            await cloudinaryDeleteImage(cloudinaryImageId);

        }
      }
      // ============== upload new image ==============

      if (deleteCloudinaryImage) {
        const allImage = req.files?.image;

        for (let imagePath of allImage) {
          let uploadFile = await cloudnirayFileUpload(imagePath?.path);
          allUploadedImage.push(uploadFile.secure_url);
        }
        const updateProductInData = await productModel.findByIdAndUpdate(
          { _id: productId },
          { ...req.body, image: allUploadedImage },
          { new: true }
        );

        return res
          .status(200)
          .json(
            new apiResponce(
              true,
              200,
              updateProductInData,
              `product updated successfully`,
              false
            )
          );
      }
    }

    // =============== without any image 
    const updateProductInData = await productModel.findByIdAndUpdate(
      { _id: productId },
      { ...req.body },
      { new: true }
    );
    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          updateProductInData,
          `product updated successfully`,
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
          `error from update product controller ${error}`,
          true
        )
      );
  }
};

module.exports = { creatProduct, updateProduct };
