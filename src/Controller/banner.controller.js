const { apiResponce } = require("../Utils/ApiResponce.js");
const { apiError } = require("../Utils/ApiError.js");

const bannerModel = require("../Model/banner.model.js");

const {
  cloudnirayFileUpload,
  cloudinaryDeleteImage,
} = require("../Utils/cloudinary.js");

const creatBanner = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(401)
        .json(new apiError(401, null, `name credential missing`));
    }

    if (!req.files) {
      return res
        .status(401)
        .json(new apiError(401, null, `banner image credential missing `));
    }

    const nammerImage = req.files?.image;

    const uploadImage = await cloudnirayFileUpload(nammerImage[0].path);

    const isExist = await bannerModel.find({ name });

    if (isExist?.length) {
      return res
        .status(401)
        .json(new apiError(401, null, `banner already exist `));
    }

    const createBanner = await bannerModel.create({
      name,
      image: uploadImage.secure_url,
    });

    return res
      .status(200)
      .json(new apiResponce(200, createBanner, `banner created successfully`));
  } catch (error) {
    return res
      .status(501)
      .json(new apiError(501, null, `create banner error ${error}`));
  }
};

const getBanner = async (req, res) => {
  try {
    const fetchBannerData = await bannerModel.find();

    if (fetchBannerData) {
      return res
        .status(200)
        .json(
          new apiResponce(
            200,
            fetchBannerData,
            `banner data fetch successfully`
          )
        );
    }
    return res
      .status(501)
      .json(new apiError(501, null, `failed to fetch banner data `));
  } catch (error) {
    return res
      .status(501)
      .json(new apiError(501, null, `get banner error ${error}`));
  }
};

const getSingleBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const isExistBanner = await bannerModel.findById(bannerId);
    if (isExistBanner) {
      return res
        .status(200)
        .json(
          new apiResponce(
            200,
            isExistBanner,
            `single banner data fetch successfully`
          )
        );
    }
    return res
      .status(501)
      .json(new apiError(501, null, `failed to fetch single banner data `));
  } catch (error) {
    return res
      .status(501)
      .json(new apiError(501, null, `get single banner error ${error}`));
  }
};

const updateSingleBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const isExist = await bannerModel.findById(bannerId);

    if (!isExist) {
      return res
        .status(501)
        .json(new apiError(501, null, `no banner data found `));
    }

    const image = isExist.image;
    let deleteCloudinaryImage = null;
    if (req.files?.image) {
      const splitImage = image.split("/");
      const cloudinaryImageId =
        splitImage[splitImage.length - 1]?.split(".")[0];

      deleteCloudinaryImage = await cloudinaryDeleteImage(cloudinaryImageId);
    }

    if (deleteCloudinaryImage) {
      const bannerImage = req.files?.image;

      const uploadImage = await cloudnirayFileUpload(bannerImage[0].path);

      const updateBanner = await bannerModel.findByIdAndUpdate(
        { _id: bannerId },
        { ...req.body, image: uploadImage.secure_url },
        { new: true }
      );

      if (updateBanner) {
        return res
          .status(200)
          .json(
            new apiResponce(200, updateBanner, ` banner updated  successfully`)
          );
      }
    }
    return res
      .status(501)
      .json(new apiError(501, null, `failed to update banner  `));
  } catch (error) {
    return res
      .status(501)
      .json(new apiError(501, null, ` update banner error ${error}`));
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const deleteBannerData = await bannerModel.findOneAndDelete({
      _id: bannerId,
    });

    if (!deleteBannerData) {
      return res
        .status(501)
        .json(new apiError(false, 501, null, `failed to delete banner `, true));
    }
    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          deleteBannerData,
          ` banner deleted successfully`,
          false
        )
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, 501, null, ` update banner error ${error}`, true)
      );
  }
};
module.exports = {
  creatBanner,
  getBanner,
  getSingleBanner,
  updateSingleBanner,
  deleteBanner,
};
