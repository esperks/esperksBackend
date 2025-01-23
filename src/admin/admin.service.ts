import mongoose from "mongoose";
import { CurrencyChainModel } from "../auth/models/currency-chain.model";
import { WalletAddressModel } from "../auth/models/wallet-address.model";
import { RequestModel } from "../user/models/request.model";
import { RequestStatus, RequestType, WalletTypes } from "../common/enum.common";
import { WalletModel } from "../user/models/wallet.model";
import { AdminControlModel } from "./models/adminControls.model";

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
        const amount = updatedRequest.amount;
        let fee = amount * 0.1;
        const depositRequestFee = await AdminControlModel.findOne();
        if (depositRequestFee) {
          if (depositRequestFee.depositRequestFee) {
            fee = amount * depositRequestFee.depositRequestFee;
          }
        }
        const finalAmount = amount - fee;
        await WalletModel.updateOne(
          { user: updatedRequest.user, type: WalletTypes.INVESTMENT },
          { $inc: { balance: finalAmount } }
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

const distributeCommission = async (percentage: number) => {
  try {
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

export const adminService = {
  addAddressToChain,
  createCurrencyChain,
  listCurrencyChain,
  listDepositRequests,
  removeAddressFromChain,
  toggleDepositRequestStatus,
};
