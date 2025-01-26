import { AdminWalletModel } from "../admin/models/adminWallet.model";
import { AdminModel } from "../auth/models/admin.model";
import bcrypt from "bcrypt";

export class SeederService {
  async seedAdmin() {
    const foundAdmin = await AdminModel.findOne({
      email: process.env.ADMIN_EMAIL,
    });
    if (!foundAdmin) {
      const salt = process.env.BCRYPT_SALT || "10";
      const password = await bcrypt.hash(
        process.env.ADMIN_PASSWORD?.toString() || "admin",
        parseInt(salt)
      );
      const admin = new AdminModel({
        email: process.env.ADMIN_EMAIL,
        password,
        phone: process.env.ADMIN_PHONE ?? "",
      });
      await admin.save();
      await AdminWalletModel.create({
        balance: 100,
      });
    }
  }
}
