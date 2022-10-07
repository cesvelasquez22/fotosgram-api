"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const post_model_1 = require("../models/post.model");
const postRoutes = (0, express_1.Router)();
postRoutes.get("/", (req, res) => {
    res.json({
        ok: true,
        message: "Everything is ok",
    });
});
postRoutes.post("/", [auth_1.verifyToken], (req, res) => {
    const body = req.body;
    body.user = req.user._id;
    post_model_1.Post.create(body)
        .then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield postDB.populate("user", "-password");
        res.json({
            ok: true,
            post: postDB,
        });
    }))
        .catch((err) => {
        res.json({
            ok: false,
            err,
        });
    });
});
exports.default = postRoutes;
