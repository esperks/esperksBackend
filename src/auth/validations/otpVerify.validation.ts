import { body } from "express-validator";
import { OtpTypes } from "../../common/enum.common";

export const otpValidation = [
  body("user").isString().isLength({ min: 2 }),
  body("otp").isString().isLength({ min: 6, max: 6 }),
  body("type").isString().isIn(Object.values(OtpTypes)),
];

export class OtpValidation {
  user!: string;
  otp!: string;
  type!: string;
}
