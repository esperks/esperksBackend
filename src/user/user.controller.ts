import { Response } from "express";
import { userService } from "./user.service";

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

export const userController = {
  getReferralCode,
};
