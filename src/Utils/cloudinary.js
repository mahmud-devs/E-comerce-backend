const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// ===================== upload image =========================

const cloudnirayFileUpload = async (localFilePath) => {
  try {
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(localFilePath);
    if (uploadResult) {
      fs.unlinkSync(localFilePath);
    }

    return uploadResult;
  } catch (error) {
    console.log(`cloudnirayFileUpload Error`, error);
  }
};

//  ========================== delete  image =========================

const cloudinaryDeleteImage = async (localFilePath) => {
  try {
    const delteItem = cloudinary.api.delete_resources([localFilePath], {
      type: "upload",
      resource_type: "image",
    });
    return delteItem;
  } catch (error) {
    console.log(`cloudinaryDeleteImage Error`, error);
  }
};
module.exports = { cloudnirayFileUpload, cloudinaryDeleteImage };
