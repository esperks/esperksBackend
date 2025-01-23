import { body } from "express-validator";

export const depositRequestValidation = [
  body("amount").isNumeric().withMessage("Amount is required"),
  body("currencyChain").isString().withMessage("Currency chain is required"),
  body("address").isString().withMessage("Address is required"),
];

export class DepositRequestValidation {
  amount!: number;
  currencyChain!: string;
  address!: string;
}
