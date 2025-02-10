const { apiResponce } = require("../Utils/ApiResponce.js");
const { apiError } = require("../Utils/ApiError.js");

const invoiceModel = require("../Model/invoice.model.js");
const orderModel = require("../Model/order.model");
const userModel = require("../Model/user.model.js");
const cartModel = require("../Model/cart.model.js");

const sucessPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceModel.findOne({ tran_id: id });
    if (!invoice) {
      return res.status(501).json(new apiError(false, null, `Order not found`));
    }

    invoice.payment_status = "Success";
    await invoice.save();

    // ============ update payment status

    const order = await orderModel.findById(invoice.orderId);
    const userInfo = await userModel.findById(invoice.user_id);

    console.log(userInfo);

    order.cartItem.forEach(async (item) => {
      await userInfo.cartitem.pull(item);
      await cartModel.findOneAndDelete({ _id: item });
    });
    await userInfo.save();
    order.paymentinfo.isPaid = true;
    await order.save();
    return res.redirect(`${process.env.FRONTEND_DOMAIN}/Success`);
    // return res
    //   .status(200)
    //   .json(new apiResponce(true, 200, order, `Payment Success`));
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
