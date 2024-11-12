import { body } from "express-validator";
import { OtpTypes } from "../../common/enum.common";

export const sendOtpValidation = [
  body("user").isString().isLength({ min: 2 }),
  body("type").isString().isIn(Object.values(OtpTypes)),
];

export class SendOtpValidation {
  user!: string;
  type!: string;
}
