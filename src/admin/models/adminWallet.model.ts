import mongoose, { Schema } from "mongoose";

const adminWalletSchema = new Schema({
  balance: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
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

export const AdminWalletModel = mongoose.model(
  "AdminWallet",
  adminWalletSchema
);
