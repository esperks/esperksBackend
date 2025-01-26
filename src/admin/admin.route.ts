import express from "express";
import { AdminAuthorization } from "../auth/middlewares/admin.middleware";
import { adminController } from "./admin.controller";
import { addAddressValidation } from "./validations/addAddress.validation";
import { editUserValidation } from "./validations/editUser.validation";
import { distributeComissionValidation } from "./validations/distributeComission.validation";
import { editAdminControlsValidation } from "./validations/editAdminControls.validation";

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

router.get(
  "/withdrawal-request",
  AdminAuthorization,
  adminController.listWithdrawalRequests
);

router.post(
  "/withdrawal-request/status/:requestId",
  AdminAuthorization,
  adminController.toggleWithdrawalRequestStatus
);

router.get("/users", AdminAuthorization, adminController.listUsers);

router.post(
  "/user/:userId",
  AdminAuthorization,
  editUserValidation,
  adminController.editUser
);

router.put(
  "/user/toggle/status/:userId",
  AdminAuthorization,
  adminController.toggleUserStatus
);

router.post(
  "/distribute-monthly-comission",
  AdminAuthorization,
  distributeComissionValidation,
  adminController.distributeComission
);

router.get(
  "/admin-controls",
  AdminAuthorization,
  adminController.fetchAdminControls
);

router.post(
  "/admin-controls",
  AdminAuthorization,
  editAdminControlsValidation,
  adminController.editAdminControls
);

export default router;
