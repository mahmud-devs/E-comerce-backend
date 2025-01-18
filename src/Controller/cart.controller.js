const { apiResponce } = require("../Utils/ApiResponce.js");
const { apiError } = require("../Utils/ApiError.js");
const cartModel = require("../Model/cart.model.js");
const userModel = require("../Model/user.model.js");

const addToCart = async (req, res) => {
  try {
    const { user, product, size, color, quantity } = req.body;
    if (!user || !product || !quantity) {
      return res
        .status(401)
        .json(
          new apiError(
            false,
            401,
            null,
            "Missing user or product or or quantity"
          )
        );
    }

    // check if the product is already in the cart
    const productInCart = await cartModel.findOne({
      product,
    });
    if (productInCart) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Product is already in the cart"));
    }

    // now save the cart information
    const saveCart = await new cartModel({
      user,
      product,
      size,
      color,
      quantity,
    }).save();
    if (!saveCart) {
      return res
        .status(501)
        .json(new apiError(false, 501, null, `Add to cart Failed`));
    }
    // search the user of user database
    const users = await userModel.findOne({ _id: user });
    users.cartitem.push(saveCart._id);
    await users.save();
    return res
      .status(200)
      .json(
        new apiResponce(true, 200, saveCart, "Add to cart Sucessfull", false)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `From addToCart controller Error :  ${error}`
        )
      );
  }
};

// cart item in user
const getCartItemuser = async (req, res) => {
  try {
    const user = req.user;
    const allCartItem = await cartModel
      .find({ user: user.userId })
      .populate({
        path: "product",
      })
      .populate({
        path: "user",
        select: "-password -Otp -cartitem -role -isVerified -recoveryEmail",
      });
    if (!allCartItem?.length) {
      return res
        .status(501)
        .json(new apiError(false, 501, null, `Cart Item NOt Found !`));
    }
    let totalItem = 0;
    let totalQuantity = 0;
    allCartItem?.map((item) => {
      const { product, quantity } = item;
      totalItem += parseInt(product.price) * parseInt(quantity);
      totalQuantity += quantity;
    });

    return res.status(200).json(
      new apiResponce(
        true,
        200,
        {
          allCartItem: allCartItem,
          totalAmount: totalItem,
          totalQuantity: totalQuantity,
        },

        "Add to cart retrive Sucessfull",
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
          `getCartItemuser addToCart controller Error :  ${error}`
        )
      );
  }
};

module.exports = { addToCart, getCartItemuser };
