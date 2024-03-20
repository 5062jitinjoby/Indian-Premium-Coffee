const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orders: [
    {
      products: [
        {
          productID: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          quantity: { type: Number },
          cost: { type: Number },
          status: { type: String, default: "Placed" },
          returnRequest: { type: Boolean, default: false },
        },
      ],
      date: { type: Date, required: true },
      address: { type: Object, required: true },
      paymentMethod: { type: String, required: true },
      billAmount: { type: String, required: true },
      coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupons" },
      couponCode: { type: String },
      orderId: { type: String, required: true },
      payment:{type:String}
    },
  ],
});

module.exports = mongoose.model("Orders", orderSchema);
  