import { Request, Response } from "express";
import { userService } from "./user.service";
import { WalletTypes } from "../common/enum.common";
import { adminService } from "../admin/admin.service";
import mongoose from "mongoose";

const getReferralCode = async (req: any, res: Response): Promise<any> => {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ message: "No authorization provided." });
  } else {
    const result = await userService.getReferralCode(userId);
    if (result.success) {
      return res.status(200).json({ code: result.code });
    } else {
      return res.status(400).json({ message: result.message });
    }
  }
};

const getWalletAddress = async (req: any, res: Response): Promise<any> => {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ message: "No authorization provided." });
  } else {
    const identifier = req.params.identifier;
    if (!Object.values(WalletTypes).includes(identifier)) {
      return res.status(400).json({ message: "Invalid wallet type." });
    }
    const result = await userService.getWalletAddress(userId, identifier);
    if (result.success) {
      return res
        .status(200)
        .json({ address: result.address, message: result.message });
    } else {
      return res.status(400).json({ message: result.message });
    }
  }
};

const addThirdPartyAddress = async (req: any, res: Response): Promise<any> => {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ message: "No authorization provided." });
  } else {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ message: "Address is required." });
    }
    const result = await userService.addThirdPartyAddress(userId, address);
    if (result.success) {
      return res
        .status(200)
        .json({ message: result.message, data: result.data });
    } else {
      return res.status(400).json({ message: result.message });
    }
  }
};

const listThirdPartyAddress = async (req: any, res: Response): Promise<any> => {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ message: "No authorization provided." });
  }
  const result = await userService.listThirdPartyAddress(userId);
  if (result.success) {
    return res.status(200).json({ message: result.message, data: result.data });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const removeThirdPartyAddress = async (
  req: any,
  res: Response
): Promise<any> => {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ message: "No authorization provided." });
  } else {
    const { addressId } = req.params;
    if (!mongoose.isValidObjectId(addressId)) {
      return res.status(400).json({ message: "Invalid address id." });
    }
    const result = await userService.removeThirdPartyAddress(userId, addressId);
    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ message: result.message });
    }
  }
};

const listCurrencyChain = async (req: any, res: Response): Promise<any> => {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ message: "No authorization provided." });
  }
  const result = await adminService.listCurrencyChain();
  if (result.success) {
    return res.status(200).json({ message: result.message, data: result.data });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const createDepositRequest = async (req: any, res: Response): Promise<any> => {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ message: "No authorization provided." });
  }
  const { amount, currencyChain, address, thirdPartyAddress } = req.body;
  if (!amount) {
    return res.status(400).json({ message: "Amount is required." });
  }
  if (typeof amount !== "number") {
    return res.status(400).json({ message: "Amount must be a number." });
  }
  if (!currencyChain) {
    return res.status(400).json({ message: "Currency chain is required." });
  }
  if (!mongoose.isValidObjectId(currencyChain)) {
    return res.status(400).json({ message: "Invalid Currency chain id" });
  }
  if (!address) {
    return res.status(400).json({ message: "Address is required." });
  }
  if (!mongoose.isValidObjectId(address)) {
    return res.status(400).json({ message: "Invalid address id." });
  }
  if (!thirdPartyAddress) {
    return res
      .status(400)
      .json({ message: "Third party address is required." });
  }
  if (!mongoose.isValidObjectId(thirdPartyAddress)) {
    return res.status(400).json({ message: "Invalid third party address id." });
  }
  const result = await userService.createDepositRequest(
    userId,
    amount,
    currencyChain,
    address,
    thirdPartyAddress
  );
  if (result.success) {
    return res.status(200).json({ message: result.message, data: result.data });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const listCreatedDepositRequest = async (
  req: any,
  res: Response
): Promise<any> => {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ message: "No authorization provided." });
  }
  const result = await userService.listCreatedDepositRequest(userId);
  if (result.success) {
    return res.status(200).json({ message: result.message, data: result.data });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const createWithdrawalRequest = async (
  req: any,
  res: Response
): Promise<any> => {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ message: "No authorization provided." });
  }
  const { amount, currencyChain, thirdPartyAddress } = req.body;
  if (!amount) {
    return res.status(400).json({ message: "Amount is required." });
  }
  if (typeof amount !== "number") {
    return res.status(400).json({ message: "Amount must be a number." });
  }
  if (!currencyChain) {
    return res.status(400).json({ message: "Currency chain is required." });
  }
  if (!mongoose.isValidObjectId(currencyChain)) {
    return res.status(400).json({ message: "Invalid Currency chain id" });
  }
  if (!thirdPartyAddress) {
    return res
      .status(400)
      .json({ message: "Third party address is required." });
  }
  if (!mongoose.isValidObjectId(thirdPartyAddress)) {
    return res.status(400).json({ message: "Invalid third party address id." });
  }
  const result = await userService.createWithdrawalRequest(
    userId,
    amount,
    currencyChain,
    thirdPartyAddress
  );
  if (result.success) {
    return res.status(200).json({ message: result.message, data: result.data });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const listCreatedWithdrawalRequest = async (
  req: any,
  res: Response
): Promise<any> => {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ message: "No authorization provided." });
  }
  const result = await userService.listCreatedWithdrawalRequest(userId);
  if (result.success) {
    return res.status(200).json({ message: result.message, data: result.data });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const getProfile = async (req: any, res: Response): Promise<any> => {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ message: "No authorization provided." });
  }
  const result = await userService.getProfile(userId);
  if (result.success) {
    return res.status(200).json({ message: result.message, data: result.data });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

export const userController = {
  addThirdPartyAddress,
  createDepositRequest,
  createWithdrawalRequest,
  getProfile,
  getReferralCode,
  getWalletAddress,
  listCurrencyChain,
  listCreatedDepositRequest,
  listCreatedWithdrawalRequest,
  listThirdPartyAddress,
  removeThirdPartyAddress,
};
