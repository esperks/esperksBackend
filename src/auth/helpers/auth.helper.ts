import jwt from "jsonwebtoken";
import { TokenModel } from "../models/token.model";
import mongoose from "mongoose";
import { OtpModel } from "../models/otp.model";
import { ReferralModel } from "../models/referral.model";

export const signJwt = async (
  id: string,
  role: string,
  type: string
): Promise<string> => {
  const payload = {
    id,
    role,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRY,
  });
  await TokenModel.create({
    user: new mongoose.Types.ObjectId(payload.id),
    token,
    type,
  });
  return token;
};

export const verifyJwt = async (token: string) => {
  // return jwt.verify(token, process.env.JWT_SECRET || "");
  try {
    const tokenDoc = await TokenModel.findOne({ token });
    if (!tokenDoc) {
      return {
        success: false,
        message: "Invalid token",
      };
    } else {
      const jwtVerified = jwt.verify(token, process.env.JWT_SECRET || "");
      if (jwtVerified) {
        return {
          success: true,
          message: "Token verified",
          data: jwtVerified,
        };
      } else {
        return {
          success: false,
          message: "Invalid token",
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Token Expired",
    };
  }
};

export const generateOtp = async (user: string, type: string) => {
  // const otp = Math.floor(100000 + Math.random() * 900000);
  const otp = `1111`;
  const otpExists = await OtpModel.findOne({
    user: new mongoose.Types.ObjectId(user),
    type,
  });
  if (otpExists) {
    await OtpModel.deleteOne({
      user: new mongoose.Types.ObjectId(user),
      type,
    });
  }
  await OtpModel.create({
    user: new mongoose.Types.ObjectId(user),
    otp: otp.toString(),
    type,
  });
  return otp;
};

export const generateReferralCode = async (): Promise<string> => {
  const code = `ESRF-${Math.floor(100000 + Math.random() * 900000)}`;
  const codeExists = await ReferralModel.exists({ code });
  if (!codeExists) {
    return code;
  }
  return generateReferralCode();
};
