const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      cost: { type: Number, required: true },
    },
  ],
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupons",
    default: null,
  },
  subTotal: { type: Number},
  billTotal: { type: Number},
});

module.exports = mongoose.model("Cart", cartSchema);
