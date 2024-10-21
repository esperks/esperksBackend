import mongoose, { Schema } from "mongoose";

const CurrencyChainSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  addresses: {
    type: [mongoose.Types.ObjectId],
    ref: "WalletAddress",
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

export const CurrencyChainModel = mongoose.model(
  "CurrencyChain",
  CurrencyChainSchema
);
