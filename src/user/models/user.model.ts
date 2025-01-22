import mongoose, { Schema } from "mongoose";
import { Roles } from "../../enum/auth.enum";

const userSchema = new Schema({
  role: {
    type: String,
    enum: Object.values(Roles),
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  referral: {
    type: mongoose.Types.ObjectId,
    ref: "Referral",
  },
  earningWallet: {
    type: mongoose.Types.ObjectId,
    ref: "Wallet",
  },
  investmentWallet: {
    type: mongoose.Types.ObjectId,
    ref: "Wallet",
  },
});

userSchema.pre("save", function (next) {
  if (this.firstName && this.lastName) {
    this.name = `${this.firstName} ${this.lastName}`;
  }
  next();
});

export const UserModel = mongoose.model("User", userSchema);
