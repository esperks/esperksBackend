import { body } from "express-validator";

export const addThirdPartyAddressValidation = [
  body("address").isString().withMessage("Address is required"),
];

export class AddThirdPartyAddressValidation {
  address!: string;
}
