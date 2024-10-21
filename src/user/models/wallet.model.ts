import mongoose, { Schema } from "mongoose";
import { WalletTypes } from "../../common/enum.common";

const WalletSchema = new Schema({
  address: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  lockedBalance: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: "INR",
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(WalletTypes),
  },
});
