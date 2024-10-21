import { body } from "express-validator";

export const forgotPasswordValidationEmail = [
  body("email").isEmail().isString(),
];
