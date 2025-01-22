import { Request, Response } from "express";
import { authService } from "./auth.service";
import mongoose from "mongoose";

const checkUsername = async (req: Request, res: Response): Promise<any> => {
  const { username } = req.params;
  const result = await authService.usernameExists(username);
  return res.status(200).json({ exists: result });
};

const checkReferral = async (req: Request, res: Response): Promise<any> => {
  const { referral } = req.params;
  const result = await authService.referralExists(referral);
  return res.status(200).json({ exists: result });
};

const checkEmail = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.params;
  const result = await authService.emailExists(email);
  return res.status(200).json({ exists: result });
};

const registerUser = async (req: Request, res: Response): Promise<any> => {
  const result = await authService.registerUser(req.body);
  if (result.success) {
    return res.status(201).json({
      message: result.message,
      user: result.user,
    });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  if (!mongoose.isValidObjectId(req.body.user)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  const result = await authService.verifyOtp(req.body);
  if (result.success) {
    return res.status(200).json({ message: result.message });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const sendOtp = async (req: Request, res: Response): Promise<any> => {
  if (!mongoose.isValidObjectId(req.body.user)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  const result = await authService.sendOtp(req.body);
  if (result.success) {
    return res.status(200).json({ message: result.message });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const forgotPasswordEmail = async (
  req: Request,
  res: Response
): Promise<any> => {
  const result = await authService.forgotPasswordEmail(req.body);
  if (result.success) {
    return res.status(200).json({ message: result.message });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const forgotPasswordOtp = async (req: Request, res: Response): Promise<any> => {
  if (!mongoose.isValidObjectId(req.body.user)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  const result = await authService.verifyOtp(req.body);
  if (result.success) {
    return res.status(200).json({ message: result.message });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const changePassword = async (req: Request, res: Response): Promise<any> => {
  const result = await authService.changePassword(req.body);
  if (result.success) {
    return res.status(200).json({ message: result.message });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

const userLogin = async (req: Request, res: Response): Promise<any> => {
  const result = await authService.userLogin(req.body);
  if (result.success) {
    return res
      .status(200)
      .json({
        message: result.message,
        token: result.token,
        data: result.data,
      });
  } else {
    return res
      .status(400)
      .json({ message: result.message, id: result.id ?? "" });
  }
};

const adminLogin = async (req: Request, res: Response): Promise<any> => {
  const result = await authService.adminLogin(req.body);
  if (result.success) {
    return res
      .status(200)
      .json({ message: result.message, token: result.token });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

export const authController = {
  adminLogin,
  changePassword,
  checkEmail,
  checkReferral,
  checkUsername,
  forgotPasswordEmail,
  forgotPasswordOtp,
  registerUser,
  sendOtp,
  userLogin,
  verifyOtp,
};
