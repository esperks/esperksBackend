import mongoose, { Schema } from "mongoose";

const ThirdPartyAddressSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: String,
    unique: true,
  },
});

export const ThirdPartyAddressModel = mongoose.model(
  "ThirdPartyAddress",
  ThirdPartyAddressSchema
);
