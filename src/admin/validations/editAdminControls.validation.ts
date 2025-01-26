import { body } from "express-validator";

export const editAdminControlsValidation = [
  body("depositRequestFee")
    .isNumeric()
    .withMessage("Deposit request fee must be a number."),
  body("withdrawalRequestFee")
    .isNumeric()
    .withMessage("Withdrawal request fee must be a number."),
  body("referralCommissionLevel1")
    .isNumeric()
    .withMessage("Referral commission level 1 must be a number."),
  body("referralCommissionLevel2")
    .isNumeric()
    .withMessage("Referral commission level 2 must be a number."),
  body("referralCommissionLevel3")
    .isNumeric()
    .withMessage("Referral commission level 3 must be a number."),
];

export class EditAdminControlsValidation {
  depositRequestFee!: number;
  withdrawalRequestFee!: number;
  referralCommissionLevel1!: number;
  referralCommissionLevel2!: number;
  referralCommissionLevel3!: number;
}
