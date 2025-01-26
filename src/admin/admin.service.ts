import mongoose from "mongoose";
import { CurrencyChainModel } from "../auth/models/currency-chain.model";
import { WalletAddressModel } from "../auth/models/wallet-address.model";
import { RequestModel } from "../user/models/request.model";
import { RequestStatus, RequestType, WalletTypes } from "../common/enum.common";
import { WalletModel } from "../user/models/wallet.model";
import { AdminControlModel } from "./models/adminControls.model";
import { AdminModel } from "../auth/models/admin.model";
import { UserModel } from "../user/models/user.model";
import * as bcrypt from "bcrypt";
import { AdminWalletModel } from "./models/adminWallet.model";

const getProfile = async (adminId: string) => {
  try {
    const admin = await AdminModel.findById(adminId).select("-password -__v");
    if (!admin) {
      return {
        success: false,
        message: "Admin not found.",
      };
    }
    return {
      success: true,
      message: "Admin profile",
      data: admin,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

const listCurrencyChain = async () => {
  try {
    const list = await CurrencyChainModel.find().populate(
      "addresses",
      "_id address"
    );
    return {
      success: true,
      message: "Currency chain list",
      data: list,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

const createCurrencyChain = async (name: string, addresses: Array<string>) => {
  try {
    const chainAlreadyExists = await CurrencyChainModel.findOne({
      name,
    });
    if (chainAlreadyExists) {
      return {
        success: false,
        message: "Chain already exists.",
      };
    }
    const newChain = await CurrencyChainModel.create({ name });
    let addressIds: Array<mongoose.Types.ObjectId> = [];
    for (let i = 0; i < addresses.length; i++) {
      const addressAlreadyExists = await WalletAddressModel.findOne({
        address: addresses[i],
        currencyChain: newChain._id,
      });
      if (addressAlreadyExists) {
        return {
          success: false,
          message: `Address ${addresses[i]} already exists.`,
        };
      }
      const newAddress = await WalletAddressModel.create({
        address: addresses[i],
        currencyChain: newChain._id,
      });
      addressIds.push(newAddress._id);
      await CurrencyChainModel.updateOne(
        { _id: newChain._id },
        {
          $push: { addresses: newAddress._id },
        }
      );
    }
    const updatedChain = await CurrencyChainModel.findOne({
      _id: newChain._id,
    }).populate("addresses", "_id address");
    return {
      success: true,
      message: "Chain created.",
      data: updatedChain,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

const addAddressToChain = async (chainId: string, address: string) => {
  try {
    const chain = await CurrencyChainModel.findById(chainId);
    if (!chain) {
      return {
        success: false,
        message: "Chain not found.",
      };
    }
    const addressAlreadyExists = await WalletAddressModel.findOne({
      currencyChain: new mongoose.Types.ObjectId(chainId),
      address,
    });
    if (addressAlreadyExists) {
      return {
        success: false,
        message: "Address already exists in chain.",
      };
    }
    if (chain.addresses?.length == 5) {
      return {
        success: false,
        message: "Address limit reached.",
      };
    }
    const newAddress = new WalletAddressModel({
      address,
      currencyChain: chainId,
    });
    await newAddress.save();
    const updatedChain = await CurrencyChainModel.findByIdAndUpdate(
      chainId,
      {
        $push: { addresses: newAddress._id },
      },
      { new: true }
    ).populate("addresses", "_id address");
    return {
      success: true,
      message: "Address added to chain.",
      data: updatedChain,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

const removeAddressFromChain = async (chainId: string, addressId: string) => {
  try {
    const chain = await CurrencyChainModel.findById(chainId);
    if (!chain) {
      return {
        success: false,
        message: "Chain not found.",
      };
    }
    const address = await WalletAddressModel.findById(addressId);
    if (!address) {
      return {
        success: false,
        message: "Address not found.",
      };
    }
    if (chain.addresses.indexOf(address.id) === -1) {
      return {
        success: false,
        message: "Address not found in chain.",
      };
    }
    await WalletAddressModel.updateOne(
      { _id: new mongoose.Types.ObjectId(addressId) },
      {
        $set: { deleted: true },
      }
    );
    const updatedChain = await CurrencyChainModel.findByIdAndUpdate(
      chainId,
      {
        $pull: { addresses: addressId },
      },
      { new: true }
    ).populate("addresses", "_id address");
    return {
      success: true,
      message: "Address removed from chain.",
      data: updatedChain,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

const listDepositRequests = async () => {
  try {
    const requests = await RequestModel.find({
      type: RequestType.DEPOSIT,
    })
      .populate("user", "_id email")
      .populate("address", "_id address")
      .populate("currencyChain", "_id name");
    return {
      success: true,
      message: "Deposit request list",
      data: requests,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

const distributeCommission = async (user: string, amount: number) => {
  const adminControls = await AdminControlModel.findOne();
  let referralCommissionLevel1 = 10;
  let referralCommissionLevel2 = 5;
  let referralCommissionLevel3 = 2;
  if (adminControls) {
    if (adminControls.referralCommissionLevel1) {
      referralCommissionLevel1 = adminControls.referralCommissionLevel1;
    }
    if (adminControls.referralCommissionLevel2) {
      referralCommissionLevel2 = adminControls.referralCommissionLevel2;
    }
    if (adminControls.referralCommissionLevel3) {
      referralCommissionLevel3 = adminControls.referralCommissionLevel3;
    }
  }
  const foundUser = await UserModel.findById(user);
  if (foundUser?.referredBy) {
    const parentUser = await UserModel.findOne({
      _id: foundUser?.referredBy,
    });
    if (parentUser) {
      const commission = amount * (referralCommissionLevel1 / 100);
      await WalletModel.updateOne(
        { user: parentUser._id, type: WalletTypes.EARNING },
        { $inc: { balance: commission } }
      );
    }
    const grandParentUser = await UserModel.findOne({
      _id: parentUser?.referredBy,
    });
    if (grandParentUser) {
      const commission = amount * (referralCommissionLevel2 / 100);
      await WalletModel.updateOne(
        { user: grandParentUser._id, type: WalletTypes.EARNING },
        { $inc: { balance: commission } }
      );
    }
    const greatGrandParentUser = await UserModel.findOne({
      _id: grandParentUser?.referredBy,
    });
    if (greatGrandParentUser) {
      const commission = amount * (referralCommissionLevel3 / 100);
      await WalletModel.updateOne(
        { user: greatGrandParentUser._id, type: WalletTypes.EARNING },
        { $inc: { balance: commission } }
      );
    }
  }
};

const toggleDepositRequestStatus = async (
  requestId: string,
  status: string
) => {
  try {
    const foundRequest = await RequestModel.findById(requestId);
    if (!foundRequest) {
      return {
        success: false,
        message: "Request not found.",
      };
    }
    if (
      [RequestStatus.APPROVED, RequestStatus.REJECTED].includes(
        foundRequest.status
      )
    ) {
      return {
        success: false,
        message: `Request already ${foundRequest.status}.`,
      };
    } else {
      const updatedRequest = await RequestModel.findByIdAndUpdate(
        requestId,
        {
          $set: { status },
        },
        { new: true }
      )
        .populate("user", "_id email")
        .populate("address", "_id address")
        .populate("currencyChain", "_id name");

      if (!updatedRequest) {
        return {
          success: false,
          message: "Request cannot be updated.",
        };
      }
      if (status == RequestStatus.APPROVED) {
        const requestAmount = updatedRequest.amount;
        let fee = requestAmount * 0.1;
        const adminControls = await AdminControlModel.findOne();
        if (adminControls) {
          if (adminControls.depositRequestFee) {
            fee = requestAmount * adminControls.depositRequestFee;
          }
        }
        const finalAmount = requestAmount - fee;
        await AdminWalletModel.updateOne({}, { $inc: { balance: fee } });
        await WalletModel.updateOne(
          { user: updatedRequest.user, type: WalletTypes.INVESTMENT },
          { $inc: { balance: finalAmount } }
        );
        const isFirstDepositRequest = await RequestModel.exists({
          user: updatedRequest.user,
          type: RequestType.DEPOSIT,
          status: RequestStatus.APPROVED,
        });
        if (!isFirstDepositRequest) {
          await distributeCommission(
            String(updatedRequest.user),
            requestAmount
          );
        }
      }
      return {
        success: true,
        message: "Request status updated.",
        data: updatedRequest,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

const listWithdrawalRequests = async () => {
  try {
    const requests = await RequestModel.find({
      type: RequestType.WITHDRAWAL,
    })
      .populate("user", "_id email")
      .populate("thirdPartyAddress", "_id address");
    return {
      success: true,
      message: "Withdrawal request list",
      data: requests,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

const toggleWithdrawalRequestStatus = async (
  requestId: string,
  status: string
) => {
  try {
    const foundRequest = await RequestModel.findById(requestId);
    if (!foundRequest) {
      return {
        success: false,
        message: "Request not found.",
      };
    }
    if (
      [RequestStatus.APPROVED, RequestStatus.REJECTED].includes(
        foundRequest.status
      )
    ) {
      return {
        success: false,
        message: `Request already ${foundRequest.status}.`,
      };
    } else {
      const updatedRequest = await RequestModel.findByIdAndUpdate(
        requestId,
        {
          $set: { status },
        },
        { new: true }
      )
        .populate("user", "_id email")
        .populate("thirdPartyAddress", "_id address");
      if (!updatedRequest) {
        return {
          success: false,
          message: "Request cannot be updated.",
        };
      }
      if (status == RequestStatus.APPROVED) {
        const amount = updatedRequest.amount;
        let fee = amount * 0.1;
        const adminControls = await AdminControlModel.findOne();
        if (adminControls) {
          if (adminControls.withdrawalRequestFee) {
            fee = amount * adminControls.withdrawalRequestFee;
          }
        }
        const finalAmount = amount - fee;
        await WalletModel.updateOne(
          { user: updatedRequest.user, type: WalletTypes.EARNING },
          { $inc: { balance: -amount } }
        );
      }
      return {
        success: true,
        message: "Request status updated.",
        data: updatedRequest,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

const listUsers = async () => {
  try {
    const users = await UserModel.find().select("-password -__v");
    return {
      success: true,
      message: "User list fetched successfully.",
      data: users,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

const editUser = async (
  userId: string,
  { username, firstName, lastName, password, phone }: any
) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }
    if (username) {
      const usernameExists = await UserModel.findOne({ username });
      if (usernameExists) {
        return {
          success: false,
          message: "Username already exists.",
        };
      }
    }
    if (phone) {
      const phoneExists = await UserModel.findOne({ phone });
      if (phoneExists) {
        return {
          success: false,
          message: "Phone number already exists.",
        };
      }
    }
    if (password) {
      const salt = process.env.BCRYPT_SALT || "10";
      password = await bcrypt.hash(password, parseInt(salt));
    }
    let updateObj: any = {};
    if (username) updateObj.username = username;
    if (firstName) updateObj.firstName = firstName;
    if (lastName) updateObj.lastName = lastName;
    if (password) updateObj.password = password;
    if (phone) updateObj.phone = phone;
    const name = `${firstName} ${lastName}`;
    updateObj.name = name;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: updateObj,
      },
      { new: true }
    ).select("-password -__v");
    return {
      success: true,
      message: "User updated successfully.",
      data: updatedUser,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

const toggleUserStatus = async (userId: string) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: { status: user.isActive ? false : true },
      },
      { new: true }
    ).select("-password -__v");
    return {
      success: true,
      message: "User status updated.",
      data: updatedUser,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

const distributeMonthlyCommission = async (percentage: number) => {
  try {
    const adminWallet = await AdminWalletModel.findOne();
    if (!adminWallet) {
      return {
        success: false,
        message: "Admin wallet not found.",
      };
    }
    const users = await UserModel.find();
    for (let i = 0; i < users.length; i++) {
      const investmentWallet = await WalletModel.findOne({
        user: users[i]._id,
        type: WalletTypes.INVESTMENT,
      });
      if (investmentWallet) {
        const balanceWithCommission =
          investmentWallet.balance +
          (investmentWallet.balance * percentage) / 100;
        await WalletModel.updateOne(
          { user: users[i]._id, type: WalletTypes.INVESTMENT },
          {
            $set: { balance: balanceWithCommission },
          }
        );
        await distributeCommission(
          String(users[i]._id),
          (investmentWallet.balance * percentage) / 100
        );
      }
    }
    return {
      success: true,
      message: "Commission distributed.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

const fetchAdminControls = async () => {
  try {
    const controls = await AdminControlModel.findOne();
    return {
      success: true,
      message: "Admin controls fetched.",
      data: controls,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

const editAdminControls = async (controls: any) => {
  try {
    const adminControls = await AdminControlModel.findOne();
    if (!adminControls) {
      await AdminControlModel.create(controls);
    } else {
      await AdminControlModel.updateOne({}, controls);
    }
    return {
      success: true,
      message: "Admin controls updated.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
}

export const adminService = {
  addAddressToChain,
  createCurrencyChain,
  distributeCommission,
  distributeMonthlyCommission,
  editAdminControls,
  editUser,
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
