import { Router, Request, Response } from "express";
import { verifyToken } from "../middlewares/auth";
import { Post } from "../models/post.model";

const postRoutes = Router();

postRoutes.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Everything is ok",
  });
});

postRoutes.post("/", [verifyToken], (req: any, res: Response) => {
  const body = req.body;
  body.user = req.user._id;

  Post.create(body)
    .then(async (postDB) => {
      await postDB.populate("user", "-password");

      res.json({
        ok: true,
        post: postDB,
      });
    })
    .catch((err) => {
      res.json({
        ok: false,
        err,
      });
    });
});

export default postRoutes;
