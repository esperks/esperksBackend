import express from "express";
import { UserAuthorization } from "../auth/middlewares/user.middleware";
import { userController } from "./user.controller";

const router = express.Router();

router.get("/referral-code", UserAuthorization, userController.getReferralCode);

export default router;