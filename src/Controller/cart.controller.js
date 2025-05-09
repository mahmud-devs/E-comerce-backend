const { apiResponce } = require("../Utils/ApiResponce.js");
const { apiError } = require("../Utils/ApiError.js");
const cartModel = require("../Model/cart.model.js");
const userModel = require("../Model/user.model.js");

const addToCart = async (req, res) => {
  try {
    const { product, size, color, quantity } = req.body;

    if (!product || !quantity) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, "Missing  product or quantity"));
    }

    // check if the product is already in the cart
    const productInCart = await cartModel.findOne({
      product,
    });
    if (productInCart) {
      const totalQuantity = productInCart.quantity + quantity;
      productInCart.quantity = totalQuantity;
      await productInCart.save();

      return res
        .status(200)
        .json(
          new apiResponce(
            true,
            200,
            null,
            "Product quantity increased in cart",
            false
          )
        );
    }

    // now save the cart information
    const saveCart = await new cartModel({
      user: req.user.userId,
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
    // search the user in user database
    const users = await userModel.findOne({ _id: req.user.userId });
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

//============== cart item with user and totalamount , totalQuantity
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

// =============== cart item increment

const incrementCartItem = async (req, res) => {
  try {
    const { cartid } = req.query;

    const cartItem = await cartModel.findById(cartid);
    if (!cartItem) {
      return res
        .status(501)
        .json(new apiError(false, 501, null, ` increment Failed !!`));
    }
    cartItem.quantity += 1;
    await cartItem.save();

    return res
      .status(200)
      .json(
        new apiResponce(true, 200, cartItem, "increment Sucessfull", false)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `From increment controller Error :  ${error}`
        )
      );
  }
};

// =============== cart item decrement

const decrementCartItem = async (req, res) => {
  try {
    const { cartid } = req.query;
    const decrementITem = await cartModel.findById(cartid);
    if (!decrementITem) {
      return res
        .status(501)
        .json(new apiError(false, 501, null, ` decrement Failed !!`));
    }

    if (decrementITem.quantity > 1) {
      decrementITem.quantity -= 1;
      await decrementITem.save();
    }

    return res
      .status(200)
      .json(
        new apiResponce(true, 200, decrementITem, "decrement Sucessfull", false)
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          501,
          null,
          `From decrement controller Error :  ${error}`
        )
      );
  }
};

// ================== find cart by user

const userCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const cartITem = await cartModel
      .find({ user: userId })
      .populate(["user", "product"]);

    const totalpriceofCart = cartITem.reduce(
      (initailValue, item) => {
        const { quantity, product } = item;
        initailValue.totalAmount += product.price * quantity;
        initailValue.totalQuantity += quantity;
        return initailValue;
      },
      { totalAmount: 0, totalQuantity: 0 }
    );

    return res.status(200).json(
      new apiResponce(
        true,
        200,
        {
          cartITem,
          totalamount: totalpriceofCart.totalAmount,
          totalcartitem: totalpriceofCart.totalQuantity,
        },
        "Add to cart Sucessfull",
        false
      )
    );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, 501, null, `userCart controller Error :  ${error}`)
      );
  }
};

// =================== delete cart item

const deleteCartItem = async (req, res) => {
  try {
    const { cartId } = req.query;

    const deletedCartItem = await cartModel.findOneAndDelete({
      _id: cartId,
      user: req.user.userId,
    });

    const findUserINfo = await userModel.findById({
      _id: req.user.userId,
    });

    await findUserINfo.cartitem.pull(cartId);
    await findUserINfo.save();

    if (!deletedCartItem) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, "Cart item not found", true));
    }

    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          deletedCartItem,
          "Cart item deleted successfully",
          false
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          false,
          500,
          null,
          `deleteCartItem controller Error: ${error}`,
          true
        )
      );
  }
};

module.exports = {
  addToCart,
  getCartItemuser,
  incrementCartItem,
  decrementCartItem,
  userCart,
  deleteCartItem,
};
