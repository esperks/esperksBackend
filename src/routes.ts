import express from "express";

const router = express.Router();
import authRoute from "./auth/auth.route";
import userRoute from "./user/user.route";
import adminRoute from "./admin/admin.route";

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/admin", adminRoute);

export default router;
