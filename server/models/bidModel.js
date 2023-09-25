const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    bidAmount: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Bid = mongoose.model("bids", bidSchema);
module.exports = Bid;
