import mongoose, { Schema } from "mongoose";
import { RequestStatus, RequestType } from "../../common/enum.common";

const RequestSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: Object.values(RequestType),
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currencyChain: {
    type: mongoose.Types.ObjectId,
    ref: "CurrencyChain",
    required: true,
  },
  address: {
    type: String,
    ref: "WalletAddress",
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(RequestStatus),
    default: RequestStatus.PENDING,
  },
  amount: {
    type: Number,
    required: true,
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

export const RequestModel = mongoose.model("Request", RequestSchema);
