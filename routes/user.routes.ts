import { Request, Response, Router } from "express";
import { User } from "../models/user.model";

const userRoutes = Router();

userRoutes.get("/", (req: Request, res: Response) => {
  res.json({
    ok: true,
    message: "Everything is ok",
  });
});

userRoutes.post("/", (req: Request, res: Response) => {
  const { body } = req;

  const user = {
    name: body.name,
    email: body.email,
    password: body.password,
    avatar: body.avatar,
  };

  User.create(user).then((userDB) => {
    res.json({
      ok: true,
      user: userDB,
    });
  }).catch((err) => {
    res.json({
      ok: false,
      err,
    });
  });
});

export default userRoutes;
