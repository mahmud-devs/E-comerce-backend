const { apiResponce } = require("../Utils/ApiResponce.js");
const { apiError } = require("../Utils/ApiError.js");
const orderModel = require("../Model/order.model");
const usermodel = require("../Model/user.model.js");
const invoiceModel = require("../Model/invoice.model.js");

const SSLCommerzPayment = require("sslcommerz-lts");
const crypto = require("crypto");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.ISLIVE == false;
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

      const saveInvoice = await new invoiceModel({
        user_id: userId,
        cus_details: customerinfo,
        subtotal: totalamount,
        orderId: saveorder._id,
      }).save();

      return res
        .status(200)
        .json(
          new apiResponce(
            true,
            200,
            { saveorder, saveInvoice },
            `order placed successfully `,
            false
          )
        );
    } else if (payementmethod.toLowerCase() == "online".toLowerCase()) {
      const transition_id = crypto.randomUUID().split("-")[0];

      const data = {
        total_amount: totalamount,
        currency: "BDT",
        tran_id: transition_id, // use unique tran_id for each api call
        success_url: "http://localhost:4000/api/v1/success/" + transition_id,
        fail_url: "http://localhost:4000/api/v1/fail/" + transition_id,
        cancel_url: "http://localhost:4000/api/v1/cancel/" + transition_id,
        ipn_url: "http://localhost:4000/api/v1/ipn/" + transition_id,
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: "Customer Name",
        cus_email: "customer@example.com",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const apiResponse = await sslcz.init(data);

      if (!apiResponse) {
        return res
          .status(401)
          .json(new apiError(false, 401, null, `Payment initilization failed`));
      }

      // ========== save order data
      const saveorder = await new orderModel({
        user: userId,
        cartItem: user.cartitem,
        customerinfo,
        paymentinfo,
        subtotal: totalamount,
        totalitem: totalcartitem,
      }).save();

      // ====================== save invoice data
      const saveInvoice = await new invoiceModel({
        user_id: userId,
        cus_details: customerinfo,
        subtotal: totalamount,
        orderId: saveorder._id,
        tran_id: transition_id,
      }).save();

      return res.json({ paymentgateway: apiResponse.GatewayPageURL });
    }
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, 501, null, `from order controller  :  ${error}`)
      );
  }
};

// ===================== get all order =====================

const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders
    const orders = await orderModel.find().populate({
      path: "user",
      populate: {
        path: "purchasedCart",
        model: "PurchasedCart",
        populate: {
          path: "product",
          model: "product",
        },
      },
    });
    if (!orders.length) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, "No orders found"));
    }

    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          { orders },
          "Orders fetched successfully",
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
          `Error fetching orders: ${error.message}`
        )
      );
  }
};

// =============== delete order ===============================

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if order exists
    const Deleteorder = await orderModel.findByIdAndDelete(orderId);
    if (!Deleteorder) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, "Order not found"));
    }

    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          Deleteorder,
          "Order deleted successfully",
          false
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(false, 500, null, `Error deleting order: ${error.message}`)
      );
  }
};

// ====================== get single order =============

const getSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetch the order by ID and populate relevant fields
    const order = await orderModel
      .findById(orderId)
      .populate({
        path: "user",
      })
      .populate({
        path: "purchasedCart",
        populate: {
          path: "product", // Assuming each purchasedCart item references a product
          model: "product",
        },
      });

    if (!order) {
      return res
        .status(404)
        .json(new apiError(false, 404, null, "Order not found"));
    }

    return res
      .status(200)
      .json(
        new apiResponce(
          true,
          200,
          { order },
          "Order fetched successfully",
          false
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(false, 500, null, `Error fetching order: ${error.message}`)
      );
  }
};

module.exports = { placeorder, getAllOrders, deleteOrder, getSingleOrder };
