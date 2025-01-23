import express from "express";
import { UserAuthorization } from "../auth/middlewares/user.middleware";
import { userController } from "./user.controller";
import { depositRequestValidation } from "./validations/depositRequest.validation";

const router = express.Router();

router.get("/referral-code", UserAuthorization, userController.getReferralCode);

router.get(
  "/wallet-address/:identifier",
  UserAuthorization,
  userController.getWalletAddress
);

router.get("/profile", UserAuthorization, userController.getProfile);

router.get(
  "/currency-chain",
  UserAuthorization,
  userController.listCurrencyChain
);

router.post(
  "/deposit-request",
  UserAuthorization,
  depositRequestValidation,
  userController.createDepositRequest
);

router.get(
  "/deposit-request",
  UserAuthorization,
  userController.listCreatedDepositRequest
);

export default router;
