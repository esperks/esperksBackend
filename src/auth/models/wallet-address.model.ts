import mongoose, { Schema } from "mongoose";

const WalletAddressSchema = new Schema({
  deleted: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    unique: true,
    required: true,
  },
  currencyChain: {
    type: mongoose.Types.ObjectId,
    ref: "CurrencyChain",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

export const WalletAddressModel = mongoose.model(
  "WalletAddress",
  WalletAddressSchema
);
