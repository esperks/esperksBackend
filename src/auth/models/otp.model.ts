import mongoose, { Schema } from "mongoose";
import { OtpTypes } from "../../common/enum.common";

const OtpSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(OtpTypes),
    required: true,
  },
  expiresAt: {
    type: Date,
    default: new Date(new Date().getTime() + 5 * 60000),
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 300 });

export const OtpModel = mongoose.model("Otp", OtpSchema);
