import mongoose, { Schema } from "mongoose";

const AdminControlSchema = new Schema({
  depositRequestFee: {
    type: Number,
    default: 10,
  },
  withdrawRequestFee: {
    type: Number,
    default: 10,
  },
});
AdminControlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 300 });

export const AdminControlModel = mongoose.model(
  "AdminControl",
  AdminControlSchema
);
