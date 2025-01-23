import mongoose from "mongoose";
import { generateReferralCode } from "../auth/helpers/auth.helper";
import { ReferralModel } from "../auth/models/referral.model";
import { WalletAddressModel } from "../auth/models/wallet-address.model";
import { RequestType, WalletTypes } from "../common/enum.common";
import { UserModel } from "./models/user.model";
import { WalletModel } from "./models/wallet.model";
import { RequestModel } from "./models/request.model";
import { CurrencyChainModel } from "../auth/models/currency-chain.model";

const getReferralCode = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    return { success: false, message: "User does not exist." };
  } else {
    const referral = await ReferralModel.findOne({ user: user._id });
    if (!referral) {
      const code = await generateReferralCode();
      const newReferral = await ReferralModel.create({
        user: user._id,
        code,
      });
      return { success: true, code: newReferral.code };
    } else {
      return { success: true, code: referral.code };
    }
  }
};

const getWalletAddress = async (userId: string, identifier: string) => {
  const wallet = await WalletModel.findOne({ user: userId, type: identifier });
  if (!wallet) {
    return { success: false, message: "Wallet does not exist." };
  } else {
    return { success: true, address: wallet.address };
  }
};

const createDepositRequest = async (
  userId: string,
  amount: number,
  currencyChain: string,
  address: string
) => {
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return { success: false, message: "User does not exist." };
    }
    const foundCurrencyChain = await CurrencyChainModel.findById(currencyChain);
    if (!foundCurrencyChain) {
      return { success: false, message: "Currency chain does not exist." };
    }
    const foundWaletAddress = await WalletAddressModel.findOne({
      address: new mongoose.Types.ObjectId(address),
      currencyChain: foundCurrencyChain._id,
    });
    if (!foundWaletAddress) {
      return { success: false, message: "Address does not exist." };
    }
    const newRequest = await RequestModel.create({
      type: RequestType.DEPOSIT,
      user: foundUser._id,
      currencyChain: foundCurrencyChain._id,
      address: foundWaletAddress._id,
      amount,
    });
    return { success: true, message: "Request created.", data: newRequest };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong." };
  }
};

const listCreatedDepositRequest = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    return { success: false, message: "User does not exist." };
  }
  const requests = await RequestModel.find({
    user: user._id,
    type: RequestType.DEPOSIT,
  });
  return { success: true, data: requests };
};

const getProfile = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-password");
  if (!user) {
    return { success: false, message: "User does not exist." };
  }
  return { success: true, data: user, message: "User profile fetched." };
};
export const userService = {
  createDepositRequest,
  getReferralCode,
  getWalletAddress,
  listCreatedDepositRequest,
  getProfile,
};
