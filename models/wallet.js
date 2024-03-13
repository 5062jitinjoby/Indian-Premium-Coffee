const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  balance: { type: Number, default: 0, required: true },
  transactions: [
    {
      transactionID: { type: String, required: true },
      transactionType: { type: String, required: true },
      date: { type: Date, required: true },
      amount: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Wallet", walletSchema);
