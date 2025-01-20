const { apiResponce } = require("../Utils/ApiResponce.js");
const { apiError } = require("../Utils/ApiError.js");
const orderModel = require("../Model/order.model");
const usermodel = require("../Model/user.model.js");

const placeorder = async (req, res) => {
  try {
    const { userId } = req.user;

    const { token } = req.cookies;

    let authToken = "";
    if (req.headers.authorization) {
      authToken = req.headers.authorization.replace("Bearer", "").trim();
    }

    const { customerinfo, paymentinfo } = req.body;
    const { address1, town, district } = customerinfo;
    const { payementmethod } = paymentinfo;

    //============= input validation
    if (!address1 || !town || !district || !payementmethod) {
      return res
        .status(401)
        .json(new apiError(false, 401, null, `Order credential Missing`));
    }

    //================== find user
    const user = await usermodel.findById(userId);

    //============= get userItem api

    const response = await fetch("http://localhost:4000/api/v1/userCartItem", {
      headers: {
        Authorization: authToken || token,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    const { totalamount, totalcartitem } = data?.data;

    //============== save order in database

    if (payementmethod.toLowerCase() == "cash".toLowerCase()) {
      const saveorder = await new orderModel({
        user: userId,
        cartItem: user.cartitem,
        customerinfo,
        paymentinfo,
        subtotal: totalamount,
        totalitem: totalcartitem,
      }).save();
      return res
        .status(200)
        .json(
          new apiResponce(
            true,
            200,
            saveorder,
            `order placed successfully `,
            false
          )
        );
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, 501, null, `from order controller  :  ${error}`)
      );
  }
};

module.exports = { placeorder };
