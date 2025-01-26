import { body } from "express-validator";

export const editUserValidation = [
  body("username").isString().optional(),
  body("firstName").isString().optional(),
  body("lastName").isString().optional(),
  body("password").isString().optional(),
  body("phone").isString().optional(),
];

export class EditUserValidation {
  username!: string;
  firstName!: string;
  lastName!: string;
  password!: string;
  phone!: string;
}
