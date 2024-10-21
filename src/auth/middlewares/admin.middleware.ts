import { NextFunction, RequestHandler, Response } from "express";
import { verifyJwt } from "../helpers/auth.helper";
import { JwtPayload } from "jsonwebtoken";
import { Roles } from "../../enum/auth.enum";

export const AdminAuthorization = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    res.status(401).json({ message: "Authorization required." });
  } else {
    const tokenArray = tokenHeader.split(" ");
    if (tokenArray.length !== 2) {
      res.status(401).json({ message: "Invalid authorization." });
    } else {
      if (tokenArray[0] !== "Bearer") {
        res.status(401).json({ message: "Invalid authorization token." });
      } else {
        const token = tokenArray[1];
        const isVerified = await verifyJwt(token);
        if (isVerified.success) {
          const decodedToken = isVerified.data as JwtPayload;
          if (decodedToken.role !== Roles.ADMIN) {
            res.status(401).json({ message: "Please provide admin token." });
          } else {
            req.user = decodedToken.id;
            next();
          }
        } else {
          res.status(401).json({ message: "Invalid token." });
        }
      }
    }
  }
};
