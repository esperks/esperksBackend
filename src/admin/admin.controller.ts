import { Request, Response } from "express";
import { adminService } from "./admin.service";
import mongoose from "mongoose";
import { RequestStatus } from "../common/enum.common";

const getProfile = async (req: any, res: Response): Promise<any> => {
  console.log(req["user"]);
  const result = await adminService.getProfile(req["user"]);
  if (result.success) {
    return res.status(200).json({ message: result.message, data: result.data });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

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
  const { chainId } = req.params;
  const { address } = req.body;
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
  const { chainId } = req.params;
  const { address } = req.body;
  if (!mongoose.isValidObjectId(chainId)) {
    return res.status(400).json({ message: "Invalid chain id." });
  } else {
    if (!address) {
      return res.status(400).json({ message: "Address id is required." });
    }
    if (!mongoose.isValidObjectId(address)) {
      return res.status(400).json({ message: "Invalid address id." });
    } else {
      const result = await adminService.removeAddressFromChain(
        chainId,
        address
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

const toggleDepositRequestStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { requestId } = req.params;
  const { status } = req.body;
  if (!mongoose.isValidObjectId(requestId)) {
    return res.status(400).json({ message: "Invalid request id." });
  } else {
    if (!Object.values(RequestStatus).includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    } else {
      const result = await adminService.toggleDepositRequestStatus(
        requestId,
        status
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

const listWithdrawalRequests = async (
  req: Request,
  res: Response
): Promise<any> => {
  const result = await adminService.listWithdrawalRequests();
  if (result.success) {
    return res.status(200).json({ message: result.message, data: result.data });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const toggleWithdrawalRequestStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { requestId } = req.params;
  const { status } = req.body;
  if (!mongoose.isValidObjectId(requestId)) {
    return res.status(400).json({ message: "Invalid request id." });
  } else {
    if (!Object.values(RequestStatus).includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    } else {
      const result = await adminService.toggleWithdrawalRequestStatus(
        requestId,
        status
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

const listUsers = async (req: Request, res: Response): Promise<any> => {
  const result = await adminService.listUsers();
  if (result.success) {
    return res.status(200).json({ message: result.message, data: result.data });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const editUser = async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.params;
  const { username, firstName, lastName, name, password, phone } = req.body;
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid user id." });
  } else {
    const result = await adminService.editUser(userId, {
      username,
      firstName,
      lastName,
      name,
      password,
      phone,
    });
    if (result.success) {
      return res
        .status(200)
        .json({ message: result.message, data: result.data });
    } else {
      return res.status(400).json({ message: result.message });
    }
  }
};

const toggleUserStatus = async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid user id." });
  } else {
    const result = await adminService.toggleUserStatus(userId);
    if (result.success) {
      return res
        .status(200)
        .json({ message: result.message, data: result.data });
    } else {
      return res.status(400).json({ message: result.message });
    }
  }
};

const distributeComission = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { percentage } = req.body;
  if (!percentage) {
    return res.status(400).json({ message: "Percentage is required." });
  }
  if (typeof percentage !== "number") {
    return res.status(400).json({ message: "Percentage must be a number." });
  }
  const result = await adminService.distributeMonthlyCommission(percentage);
  if (result.success) {
    return res.status(200).json({ message: result.message });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const fetchAdminControls = async (
  req: Request,
  res: Response
): Promise<any> => {
  const result = await adminService.fetchAdminControls();
  if (result.success) {
    return res.status(200).json({ message: result.message, data: result.data });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const editAdminControls = async (req: Request, res: Response): Promise<any> => {
  const {
    depositRequestFee,
    withdrawalRequestFee,
    referralCommissionLevel1,
    referralCommissionLevel2,
    referralCommissionLevel3,
  } = req.body;
  let data: any = {};
  if (depositRequestFee) {
    data.depositRequestFee = depositRequestFee;
  }
  if (withdrawalRequestFee) {
    data.withdrawalRequestFee = withdrawalRequestFee;
  }
  if (referralCommissionLevel1) {
    data.referralCommissionLevel1 = referralCommissionLevel1;
  }
  if (referralCommissionLevel2) {
    data.referralCommissionLevel2 = referralCommissionLevel2;
  }
  if (referralCommissionLevel3) {
    data.referralCommissionLevel3 = referralCommissionLevel3;
  }
  const result = await adminService.editAdminControls(data);
  if (result.success) {
    return res.status(200).json({ message: result.message });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

export const adminController = {
  addAddressToChain,
  createCurrencyChain,
  distributeComission,
  editUser,
  editAdminControls,
  fetchAdminControls,
  getProfile,
  listCurrencyChain,
  listDepositRequests,
  listUsers,
  listWithdrawalRequests,
  removeAddressFromChain,
  toggleDepositRequestStatus,
  toggleWithdrawalRequestStatus,
  toggleUserStatus,
};
