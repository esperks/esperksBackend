import express from "express";
import { UserAuthorization } from "../auth/middlewares/user.middleware";
import { userController } from "./user.controller";

const router = express.Router();

router.get("/referral-code", UserAuthorization, userController.getReferralCode);
router.get(
  "/wallet-address/:identifier",
  UserAuthorization,
  userController.getWalletAddress
);
router.get("/profile", UserAuthorization, userController.getProfile);
// router.post("/deposit-request", UserAuthorization, userController.createDepositRequest);
export default router;
