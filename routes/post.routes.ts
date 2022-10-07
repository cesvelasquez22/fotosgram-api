import { Router, Request, Response } from "express";
import { verifyToken } from "../middlewares/auth";
import { Post } from "../models/post.model";
import { FileUpload } from "../types/file-upload";

const postRoutes = Router();

postRoutes.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  let skip = page - 1;
  skip = skip * 10;

  const posts = await Post.find()
    .sort({ _id: -1 })
    .skip(skip)
    .limit(10)
    .populate("user", "-password")
    .exec();

  res.json({
    ok: true,
    page,
    results: posts.length,
    posts,
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

postRoutes.post("/upload", [verifyToken], async (req: any, res: Response) => {
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      message: "No files were uploaded.",
    });
  }

  const file = req.files.image as FileUpload;
  if (!file.mimetype.includes("image")) {
    return res.status(400).json({
      ok: false,
      message: "The file is not an image",
    });
  }

  // await file.mv(`uploads/${file.name}`);

  res.json({
    ok: true,
    file: file.name,
  });
});

export default postRoutes;
