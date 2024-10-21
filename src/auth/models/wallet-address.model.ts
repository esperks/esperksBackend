import mongoose, { Schema } from "mongoose";

const WalletAddressSchema = new Schema({
  address: {
    type: String,
    unique: true,
    required: true,
  },
  currencyChain: {
    type: new mongoose.Types.ObjectId(),
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
