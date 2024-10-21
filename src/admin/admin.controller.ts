import { Response } from "express";
import { adminService } from "./admin.service";

const listCurrencyChain = async (req: Request, res: Response) => {
  const result = await adminService.listCurrencyChain();
  if (result.success) {
    return res.status(200).json({ message: result.message, data: result.data });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

export const adminController = {
  listCurrencyChain,
};
