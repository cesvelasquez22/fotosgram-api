import { Request, Response, Router } from "express";
import { IUser, User } from "../models/user.model";
import bcrypt from "bcrypt";
import Token from "../classes/token";
import { verifyToken } from "../middlewares/auth";

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

  User.findOne({ email: body.email }, (err: any, userDB: IUser) => {
    if (err) throw err;

    if (!userDB) {
      return res.json({
        ok: false,
        message: "User / password are incorrect",
      });
    }

    if (userDB.comparePassword(body.password)) {
      const token = Token.getJwtToken({
        _id: userDB._id,
        name: userDB.name,
        email: userDB.email,
        avatar: userDB.avatar,
      });

      res.json({
        ok: true,
        token,
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

  User.create(user)
    .then((userDB) => {
      const token = Token.getJwtToken({
        _id: userDB._id,
        name: userDB.name,
        email: userDB.email,
        avatar: userDB.avatar,
      });

      res.json({
        ok: true,
        // user: userDB,
        token,
      });
    })
    .catch((err) => {
      res.json({
        ok: false,
        err,
      });
    });
});

userRoutes.put("/", verifyToken, (req: any, res: Response) => {
  const { body } = req;

  const currentUser = req.user;

  const user = {
    name: body.name || currentUser.name,
    email: body.email || currentUser.email,
    avatar: body.avatar || currentUser.avatar,
  };

  User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {
    if (err) throw err;

    if (!userDB) {
      return res.json({
        ok: false,
        message: "User not found",
      });
    }

    const token = Token.getJwtToken({
      _id: userDB._id,
      name: userDB.name,
      email: userDB.email,
      avatar: userDB.avatar,
    });

    res.json({
      ok: true,
      // user: userDB,
      token,
    });
  });
});

export default userRoutes;
