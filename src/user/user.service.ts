import { generateReferralCode } from "../auth/helpers/auth.helper";
import { ReferralModel } from "../auth/models/referral.model";
import { UserModel } from "./models/user.model";

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

export const userService = {
  getReferralCode,
};
