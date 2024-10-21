import express from "express";
import { authController } from "./auth.controller";
import { registerValidation } from "./validations/register.validation";
import { otpValidation } from "./validations/otpVerify.validation";
import { forgotPasswordValidationEmail } from "./validations/forgotPassword.validation";
import { UserAuthorization } from "./middlewares/user.middleware";
import { loginValidation } from "./validations/login.validation";

const router = express.Router();

router.get("/username/check/:username", authController.checkUsername);
router.get("/referral/check/:referral", authController.checkReferral);
router.get("/email/check/:email", authController.checkEmail);
router.post("/register", registerValidation, authController.registerUser);
router.post("/verify-otp", otpValidation, authController.verifyOtp);
router.post("/send-otp", otpValidation, authController.sendOtp);
router.post(
  "/forgot-password/email",
  forgotPasswordValidationEmail,
  authController.forgotPasswordEmail
);
router.post(
  "/forgot-password/otp",
  otpValidation,
  authController.forgotPasswordOtp
);
router.post("/change-password", authController.changePassword);
router.post("/user/login", loginValidation, authController.userLogin);
router.post("/admin/login", loginValidation, authController.adminLogin);

export default router;
