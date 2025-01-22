import { Request, Response } from "express";
import { adminService } from "./admin.service";
import mongoose from "mongoose";

const listCurrencyChain = async (req: Request, res: Response): Promise<any> => {
  const result = await adminService.listCurrencyChain();
  if (result.success) {
    return res.status(200).json({ message: result.message, data: result.data });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const createCurrencyChain = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { name, addresses } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required." });
  }
  if (typeof name !== "string") {
    return res.status(400).json({ message: "Name must be a string." });
  }
  let addressList = [];
  if (addresses) {
    if (typeof addresses !== "object") {
      return res.status(400).json({ message: "Addresses must be an array." });
    }
    if (!Array.isArray(addresses)) {
      return res.status(400).json({ message: "Addresses must be an array." });
    }
    if (addresses.length > 0) {
      for (let i = 0; i < addresses.length; i++) {
        if (typeof addresses[i] !== "string") {
          return res.status(400).json({ message: "Address must be a string." });
        }
      }
      addressList = addresses;
    }
  }
  const result = await adminService.createCurrencyChain(name, addressList);
  if (result.success) {
    return res.status(200).json({ message: result.message, data: result.data });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const addAddressToChain = async (req: Request, res: Response): Promise<any> => {
  const { chainId, address } = req.body;
  if (!mongoose.isValidObjectId(chainId)) {
    return res.status(400).json({ message: "Invalid chain id." });
  } else {
    if (!address) {
      return res.status(400).json({ message: "Address is required." });
    }
    if (typeof address !== "string") {
      return res.status(400).json({ message: "Address must be a string." });
    }
    const result = await adminService.addAddressToChain(chainId, address);
    if (result.success) {
      return res
        .status(200)
        .json({ message: result.message, data: result.data });
    } else {
      return res.status(400).json({ message: result.message });
    }
  }
};

const removeAddressFromChain = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { chainId, addressId } = req.body;
  if (!mongoose.isValidObjectId(chainId)) {
    return res.status(400).json({ message: "Invalid chain id." });
  } else {
    if (!mongoose.isValidObjectId(addressId)) {
      return res.status(400).json({ message: "Invalid address id." });
    } else {
      const result = await adminService.removeAddressFromChain(
        chainId,
        addressId
      );
      if (result.success) {
        return res
          .status(200)
          .json({ message: result.message, data: result.data });
      } else {
        return res.status(400).json({ message: result.message });
      }
    }
  }
};

const listDepositRequests = async (
  req: Request,
  res: Response
): Promise<any> => {
  const result = await adminService.listDepositRequests();
  if (result.success) {
    return res.status(200).json({ message: result.message, data: result.data });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

export const adminController = {
  createCurrencyChain,
  listCurrencyChain,
  listDepositRequests,
  addAddressToChain,
  removeAddressFromChain,
};
