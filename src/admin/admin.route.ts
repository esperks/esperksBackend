import express from "express";
import { AdminAuthorization } from "../auth/middlewares/admin.middleware";
import { adminController } from "./admin.controller";
import { addAddressValidation } from "./validations/addAddress.validation";

const router = express.Router();

router.get("/profile", AdminAuthorization, adminController.getProfile);

router.get(
  "/currency-chain",
  AdminAuthorization,
  adminController.listCurrencyChain
);

router.post(
  "/currency-chain",
  AdminAuthorization,
  adminController.createCurrencyChain
);

router.post(
  "/currency-chain/address/:chainId",
  AdminAuthorization,
  addAddressValidation,
  adminController.addAddressToChain
);

router.delete(
  "/currency-chain/address/:chainId",
  AdminAuthorization,
  addAddressValidation,
  adminController.removeAddressFromChain
);

router.get(
  "/deposit-request",
  AdminAuthorization,
  adminController.listDepositRequests
);

router.post(
  "/deposit-request/status/:requestId",
  AdminAuthorization,
  adminController.toggleDepositRequestStatus
);

export default router;
