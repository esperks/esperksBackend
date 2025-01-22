import mongoose, { Schema } from "mongoose";
import { WalletTypes } from "../../common/enum.common";

const WalletSchema = new Schema({
  address: {
    type: String,
    unique: true,
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

WalletSchema.pre("save", function (next) {
  if (this.isNew) {
    this.balance = 0;
    this.lockedBalance = 0;
  }
  const identifier = this.type === WalletTypes.EARNING ? "EW" : "IW";
  this.address = `${identifier}-${Date.now()}`;
  next();
});
export const WalletModel = mongoose.model("Wallet", WalletSchema);
