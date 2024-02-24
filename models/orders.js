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
        },
      ],
      date: { type: Date, required: true },
      address:{type:Object,required:true}
    },
  ],
});

module.exports = mongoose.model("Orders", orderSchema);
