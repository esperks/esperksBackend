import mongoose from "mongoose";
import { ReferralModel } from "./models/referral.model";
import { UserModel } from "../user/models/user.model";
import { OtpValidation } from "./validations/otpVerify.validation";
import { RegisterValidation } from "./validations/register.validation";
import * as bcrypt from "bcrypt";
import { OtpModel } from "./models/otp.model";
import { OtpTypes, TokenTypes, WalletTypes } from "../common/enum.common";
import { ChangePasswordValidation } from "./validations/changePassword.validation";
import {
  generateOtp,
  generateReferralCode,
  signJwt,
  verifyJwt,
} from "./helpers/auth.helper";
import { JwtPayload } from "jsonwebtoken";
import { Roles } from "../enum/auth.enum";
import { LoginValidation } from "./validations/login.validation";
import { AdminModel } from "./models/admin.model";
import { mailerService } from "../mailer/mailer.service";
import { SendOtpValidation } from "./validations/sendOtp.validation";
import { WalletModel } from "../user/models/wallet.model";

const usernameExists = async (username: string) => {
  const exists = await UserModel.exists({ username });
  if (exists) {
    return true;
  } else {
    return false;
  }
};

const referralExists = async (code: string) => {
  const exists = await ReferralModel.exists({ code });
  if (exists) {
    return true;
  } else {
    return false;
  }
};

const emailExists = async (email: string) => {
  const exists = await UserModel.exists({ email });
  if (exists) {
    return true;
  } else {
    return false;
  }
};

const registerUser = async (data: RegisterValidation) => {
  try {
    const userWithSameEmail = await UserModel.exists({ email: data.email });
    if (userWithSameEmail) {
      return {
        success: false,
        message: "User already exists. Please use a different email address",
      };
    } else {
      const userWithSameUsername = await UserModel.exists({
        username: data.username,
      });
      if (userWithSameUsername) {
        return {
          success: false,
          message: "User already exists. Please use a different username",
        };
      }
      if (data.referral) {
        const validReferral = await ReferralModel.exists({
          code: data.referral,
          active: true,
        });
        if (!validReferral) {
          return { success: false, message: "Invalid referral code" };
        }
      }
      const user = new UserModel();
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.username = data.username;
      user.email = data.email;
      const salt = process.env.BCRYPT_SALT || "10";
      user.password = await bcrypt.hash(data.password, parseInt(salt));
      user.phone = data.phone;
      const createdUser = await user.save();
      if (data.referral) {
        await ReferralModel.updateOne(
          { code: data.referral },
          { $inc: { redeemCount: 1 }, $push: { redeemedBy: user._id } }
        );
      }
      const investmentWallet = await WalletModel.create({
        user: createdUser._id,
        type: WalletTypes.INVESTMENT,
      });
      const earningWallet = await WalletModel.create({
        user: createdUser._id,
        type: WalletTypes.EARNING,
      });
      await UserModel.updateOne(
        { _id: createdUser._id },
        {
          investmentWallet: investmentWallet._id,
          earningWallet: earningWallet._id,
        }
      );
      const otp = await generateOtp(createdUser.id, OtpTypes.EMAIL_VERIFY);
      // await mailerService.sendMail({
      //   to: user.email,
      //   subject: "Email Verification",
      //   text: `Please verify your rmail, OTP is ${otp}`,
      // });
      console.log("OTP:", otp);
      return {
        success: true,
        message: "User registered successfully. Please verify your email",
        user: createdUser._id,
      };
    }
  } catch (error) {
    console.error("Error in registerUser", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
};

const verifyOtp = async (data: OtpValidation) => {
  try {
    const userExists = await UserModel.exists({
      _id: new mongoose.Types.ObjectId(data.user),
    });
    if (!userExists) {
      return { success: false, message: "User does not exist." };
    } else {
      const otpDoc = await OtpModel.findOne({
        user: new mongoose.Types.ObjectId(data.user),
        type: data.type,
      });
      if (!otpDoc) {
        return { success: false, message: "OTP expired." };
      } else {
        if (otpDoc.otp !== data.otp) {
          return { success: false, message: "Invalid OTP." };
        } else {
          if (data.type == OtpTypes.EMAIL_VERIFY) {
            const referralExists = await ReferralModel.exists({
              user: new mongoose.Types.ObjectId(data.user),
            });
            let updateObj: any = {
              isEmailVerified: true,
            };
            if (!referralExists) {
              const code = await generateReferralCode();
              const createdReferral = await ReferralModel.create({
                user: new mongoose.Types.ObjectId(data.user),
                code,
              });
              updateObj.referral = createdReferral._id;
            }
            await UserModel.updateOne(
              {
                _id: new mongoose.Types.ObjectId(data.user),
              },
              {
                $set: updateObj,
              }
            );
          }
          const token = await signJwt(
            data.user,
            Roles.USER,
            data.type == OtpTypes.FORGOT_PASSWORD
              ? TokenTypes.FORGOT_PASSWORD
              : TokenTypes.ACCESS
          );
          await OtpModel.deleteOne({
            user: new mongoose.Types.ObjectId(data.user),
            type: data.type,
          });
          return {
            success: true,
            message: "OTP verified successfully.",
            token,
          };
        }
      }
    }
  } catch (error) {
    console.error("Error in verifyOtp", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
};

const sendOtp = async (data: SendOtpValidation) => {
  try {
    const user = await UserModel.findOne({
      _id: new mongoose.Types.ObjectId(data.user),
    });
    if (!user) {
      return { success: false, message: "User does not exist." };
    } else {
      const otp = await generateOtp(data.user, data.type);
      // await mailerService.sendMail({
      //   to: user.email,
      //   subject: "Verify OTP",
      //   text: `The verification OTP is ${otp}. Please do not share it with anyone.`,
      // });
      return { success: true, message: "OTP sent successfully." };
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
};

const forgotPasswordEmail = async (data: { email: string }) => {
  try {
    const user = await UserModel.findOne({ email: data.email });
    if (!user) {
      return { success: false, message: "User does not exist." };
    } else {
      await generateOtp(user.id, OtpTypes.FORGOT_PASSWORD);
      return { success: true, message: "Otp sent to the email.", id: user.id };
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
};

const changePassword = async (data: ChangePasswordValidation) => {
  try {
    const validToken: any = await verifyJwt(data.token);
    if (!validToken.success) {
      return { success: false, message: "Invalid token." };
    } else {
      const userId = validToken.data
        ? (validToken.data as JwtPayload)["id"]
        : "";
      const user = await UserModel.findById(userId);
      if (!user) {
        return { success: false, message: "User does not exist." };
      } else {
        const oldPasswordMatch = await bcrypt.compare(
          data.oldPassword,
          user.password
        );
        if (!oldPasswordMatch) {
          return { success: false, message: "Invalid old password." };
        }
        const salt = process.env.BCRYPT_SALT || "10";
        const newPassword = await bcrypt.hash(data.newPassword, parseInt(salt));
        await UserModel.updateOne({ _id: user._id }, { password: newPassword });
        return { success: true, message: "Password changed successfully." };
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
};

const userLogin = async (data: LoginValidation) => {
  try {
    const user = await UserModel.findOne({
      $or: [{ email: data.email }, { username: data.email }],
    });
    if (!user) {
      return { success: false, message: "User does not exist." };
    } else {
      const passwordMatch = await bcrypt.compare(data.password, user.password);
      if (!passwordMatch) {
        return { success: false, message: "Invalid password." };
      } else {
        if (!user.isEmailVerified) {
          await generateOtp(user.id, OtpTypes.EMAIL_VERIFY);
          return {
            success: false,
            id: user.id,
            message: "Otp sent to the email. Please verify to login.",
          };
        }
        const token = await signJwt(user.id, Roles.USER, TokenTypes.ACCESS);
        return {
          success: true,
          message: "Login successful.",
          token,
          data: {
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            profileImage: user.profileImage ?? "",
          },
        };
      }
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
};

const adminLogin = async (data: LoginValidation) => {
  try {
    const admin = await AdminModel.findOne({ email: data.email });
    if (!admin) {
      return { success: false, message: "Admin does not exist." };
    } else {
      const passwordMatch = await bcrypt.compare(data.password, admin.password);
      if (!passwordMatch) {
        return { success: false, message: "Invalid password." };
      } else {
        const token = await signJwt(admin.id, Roles.ADMIN, "");
        return { success: true, message: "Login successful.", token };
      }
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
};

export const authService = {
  adminLogin,
  changePassword,
  emailExists,
  forgotPasswordEmail,
  referralExists,
  registerUser,
  sendOtp,
  usernameExists,
  userLogin,
  verifyOtp,
};
