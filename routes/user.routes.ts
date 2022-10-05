import { Request, Response, Router } from "express";

const userRoutes = Router();

userRoutes.get("/", (req: Request, res: Response) => {
  res.json({
    ok: true,
    message: "Everything is ok",
  });
});

export default userRoutes;
