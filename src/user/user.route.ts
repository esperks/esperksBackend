import express from "express";
import { UserAuthorization } from "../auth/middlewares/user.middleware";
import { userController } from "./user.controller";
import { depositRequestValidation } from "./validations/depositRequest.validation";
import { withdrawalRequestValidation } from "./validations/withdrawalRequest.validation";
import { addThirdPartyAddressValidation } from "./validations/addThirdPartyAddress.model";

const router = express.Router();

router.get("/referral-code", UserAuthorization, userController.getReferralCode);

router.get(
  "/wallet-address/:identifier",
  UserAuthorization,
  userController.getWalletAddress
);

router.get("/profile", UserAuthorization, userController.getProfile);

router.post(
  "/third-party-address",
  UserAuthorization,
  addThirdPartyAddressValidation,
  userController.addThirdPartyAddress
);

router.get(
  "/third-party-address",
  UserAuthorization,
  userController.listThirdPartyAddress
);

router.delete(
  "/third-party-address/:addressId",
  UserAuthorization,
  userController.removeThirdPartyAddress
);

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

router.post(
  "/withdrawal-request",
  UserAuthorization,
  withdrawalRequestValidation,
  userController.createWithdrawalRequest
);

router.get(
  "/withdrawal-request",
  UserAuthorization,
  userController.listCreatedWithdrawalRequest
);

export default router;
