import { body } from "express-validator";

export const addAddressValidation = [
  body("address").isString().withMessage("Address is required"),
];

export class AddAddressValidation {
  chainId!: string;
  address!: string;
}
