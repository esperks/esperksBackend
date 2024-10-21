import mongoose from "mongoose";
import { TokenTypes } from "../../common/enum.common";

export const tokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(TokenTypes),
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const secondsInWeek = 60 * 60 * 24 * 7;
tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: secondsInWeek });

export const TokenModel = mongoose.model("Token", tokenSchema);
