const { apiResponce } = require("../Utils/ApiResponce.js");
const { apiError } = require("../Utils/ApiError.js");

const invoiceModel = require("../Model/invoice.model.js");
const orderModel = require("../Model/order.model");
const userModel = require("../Model/user.model.js");
const cartModel = require("../Model/cart.model.js");
const purchasedCartModel = require("../Model/purchasedCart.model.js");

const sucessPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceModel.findOne({ tran_id: id });
    if (!invoice) {
      return res.status(501).json(new apiError(false, null, `Order not found`));
    }

    invoice.payment_status = "Success";
    await invoice.save();

    // ============ Update payment status ============
    const order = await orderModel.findById(invoice.orderId);
    const userInfo = await userModel.findById(invoice.user_id);

    const purchasedItems = []; //  Array to store purchaed cart item IDs

    // Loop through each item in the cart before deleting
    for (const item of order.cartItem) {
      const cartItem = await cartModel.findById(item);
      if (cartItem) {
        //  Create a new PurchasedCart entry to save the purchased item
        const purchasedCartItem = await new purchasedCartModel({
          user: cartItem.user,
          product: cartItem.product,
          size: cartItem.size,
          color: cartItem.color,
          quantity: cartItem.quantity,
          subTotal: cartItem.subTotal,
        }).save();

        purchasedItems.push(purchasedCartItem._id); //  Store PurchasedCart ID for later reference

        await order.cartItem.pull(cartItem._id);
        await userInfo.cartitem.pull(cartItem._id); // Remove from cart
        await cartModel.findByIdAndDelete(cartItem._id); // Delete original cart item
      }
    }

    //  Push all purchased cart item IDs to the new `purchasedCart` field in the User model
    userInfo.purchasedCart.push(...purchasedItems);
    await userInfo.save(); // Save user with updated purchased cart

    order.paymentinfo.isPaid = true;
    await order.save();

    // ================
    order.purchasedCart = purchasedItems;
    await order.save();

    return res.redirect(`${process.env.FRONTEND_DOMAIN}/Success`);
  } catch (error) {
    return res.status(501).json(new apiError(false, null, `Payment Fail`));
  }
};
// ============== failed payment

const failPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceModel.findOne({ tran_id: id });
    if (!invoice) {
      return res.status(501).json(new apiError(false, null, `Order not found`));
    }

    invoice.payment_status = "Failed";
    await invoice.save();

    // ============ update payment status
    const order = await orderModel.findById(invoice.orderId);
    order.paymentinfo.isPaid = false;
    await order.save();
    return res.redirect(`${process.env.FRONTEND_DOMAIN}/Failed`);
    // return res
    //   .status(200)
    //   .json(new apiResponce(true, 200, order, `Payment Success`));
  } catch (error) {
    return res.status(501).json(new apiError(false, null, `Payment Fail`));
  }
};

//================= cancle payment

const canclePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceModel.findOne({ tran_id: id });
    if (!invoice) {
      return res.status(501).json(new apiError(false, null, `Order not found`));
    }

    invoice.payment_status = "Canceled";
    await invoice.save();

    // ============ update payment status
    const order = await orderModel.findById(invoice.orderId);
    order.paymentinfo.isPaid = false;
    await order.save();
    return res.redirect(`${process.env.FRONTEND_DOMAIN}/Cancel`);
    // return res
    //   .status(200)
    //   .json(new apiResponce(true, 200, order, `Payment Success`));
  } catch (error) {
    return res.status(501).json(new apiError(false, null, `Payment Fail`));
  }
};

//  ====================== ipn payment

const ipn = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await invoice.findOne({ tran_id: id });
    if (!invoice) {
      return res.status(501).json(new apiError(false, null, `Order not found`));
    }
    invoice.payment_status = "Success";
    await invoice.save();
    // ============ update payment status
    const order = await orderModel.findById(invoice.orderId);
    order.paymentinfo.isPaid = true;
    await order.save();

    return res
      .status(200)
      .json(new apiResponce(true, 200, order, `Payment Success`));
  } catch (error) {
    return res.status(501).json(new apiError(false, null, `Payment Fail`));
  }
};
module.exports = { sucessPayment, failPayment, canclePayment };
