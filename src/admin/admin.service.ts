import { CurrencyChainModel } from "../auth/models/currency-chain.model";

const listCurrencyChain = async () => {
  try {
    const list = await CurrencyChainModel.find();
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

export const adminService = {
  listCurrencyChain,
};
