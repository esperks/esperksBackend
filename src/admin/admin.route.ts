import express from "express";
import { AdminAuthorization } from "../auth/middlewares/admin.middleware";
import { adminController } from "./admin.controller";

const router = express.Router();

router.get(
  "currency-chain",
  AdminAuthorization,
  adminController.listCurrencyChain
);
