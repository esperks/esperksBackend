import { body } from "express-validator";

export const loginValidation = [
  body("email").isEmail().withMessage("Email is required"),
  body("password").isString().withMessage("Password is required"),
];

export class LoginValidation {
  email!: string;
  password!: string;
}
