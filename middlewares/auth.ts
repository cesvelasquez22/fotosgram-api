import Token from "../classes/token";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";

export const verifyToken = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const userToken = req.get("x-token") || "";
  Token.checkToken(userToken)
    .then((decoded: any) => {
      console.log("decoded", decoded);
      req.user = decoded.user;
      next();
    })
    .catch((err) => {
      res.json({
        ok: false,
        err,
      });
    });
};
