import { body } from "express-validator";

export const distributeComissionValidation = [
  body("percentage").isNumeric().withMessage("Percentage is required"),
];

export class DistributeComissionValidation {
  percentage!: number;
}
