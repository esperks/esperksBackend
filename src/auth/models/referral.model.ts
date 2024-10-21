import mongoose, { Schema } from "mongoose";

const referralSchema = new Schema({
  active: {
    type: Boolean,
    default: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  redeemedBy: {
    type: Array<mongoose.Types.ObjectId>,
    ref: "User",
    default: [],
  },
  redeemCount: {
    type: Number,
    default: 0,
  },
});

export const ReferralModel = mongoose.model("Referral", referralSchema);
