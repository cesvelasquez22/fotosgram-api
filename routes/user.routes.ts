import { Request, Response, Router } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";

const userRoutes = Router();

userRoutes.get("/", (req: Request, res: Response) => {
  res.json({
    ok: true,
    message: "Everything is ok",
  });
});

// Login
userRoutes.post("/login", (req: Request, res: Response) => {
  const body = req.body;

  User.findOne({ email: body.email }, (err, userDB) => {
    if (err) throw err;

    if (!userDB) {
      return res.json({
        ok: false,
        message: "User / password are incorrect",
      });
    }

    if (userDB.comparePassword(body.password)) {
      res.json({
        ok: true,
        token: "TOKEN",
      });
    } else {
      return res.json({
        ok: false,
        message: "User / password are incorrect",
      });
    }
  });
});

userRoutes.post("/", (req: Request, res: Response) => {
  const { body } = req;

  // Encrypt password
  const password = bcrypt.hashSync(body.password, 10);

  const user = {
    name: body.name,
    email: body.email,
    password,
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
