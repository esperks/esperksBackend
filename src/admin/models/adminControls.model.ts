import mongoose, { Schema } from "mongoose";

const AdminControlSchema = new Schema({
  depositRequestFee: {
    type: Number,
    default: 10,
  },
  withdrawalRequestFee: {
    type: Number,
    default: 10,
  },
  referralCommissionLevel1: {
    type: Number,
    default: 10,
  },
  referralCommissionLevel2: {
    type: Number,
    default: 5,
  },
  referralCommissionLevel3: {
    type: Number,
    default: 2,
  },
  
});
// AdminControlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 300 });

export const AdminControlModel = mongoose.model(
  "AdminControl",
  AdminControlSchema
);
