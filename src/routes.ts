import express from "express";

const router = express.Router();

router.use("/auth", require("./auth/auth.route"));
router.use("/user", require("./user/user.route"));
router.use("/admin", require("./admin/admin.route"));

export default router;
