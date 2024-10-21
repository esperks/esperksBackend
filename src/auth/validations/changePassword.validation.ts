import { body } from "express-validator";

export const changePasswordValidation = [
  body("token").isString(),
  body("oldPassword").isString().isLength({ min: 6 }),
  body("newPassword").isString().isLength({ min: 6 }),
];

export class ChangePasswordValidation {
  token!: string;
  oldPassword!: string;
  newPassword!: string;
}
