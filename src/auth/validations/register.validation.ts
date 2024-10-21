import { body } from "express-validator";

export const registerValidation = [
  body("firstName").isString().isLength({ min: 2, max: 50 }).trim(),
  body("lastName").isString().isLength({ min: 2, max: 50 }).trim().optional(),
  body("username").isString().isLength({ min: 3, max: 50 }),
  body("email").isEmail(),
  body("password").isString().isLength({ min: 6, max: 50 }),
  body("phone").isString().isLength({ min: 10, max: 15 }).optional(),
  body("referral").isString().optional(),
];

export class RegisterValidation {
  firstName!: string;
  lastName?: string;
  username!: string;
  email!: string;
  password!: string;
  phone?: string;
  referral?: string;
}
