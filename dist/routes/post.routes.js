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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
const postRoutes = (0, express_1.Router)();
const fileSystem = new file_system_1.default();
postRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10;
    const posts = yield post_model_1.Post.find()
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
}));
postRoutes.post("/", [auth_1.verifyToken], (req, res) => {
    const body = req.body;
    body.user = req.user._id;
    const images = fileSystem.moveTempImageToPost(req.user._id);
    body.imgs = images;
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
postRoutes.post("/upload", [auth_1.verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: "No files were uploaded.",
        });
    }
    const file = req.files.image;
    if (!file.mimetype.includes("image")) {
        return res.status(400).json({
            ok: false,
            message: "The file is not an image",
        });
    }
    // await file.mv(`uploads/${file.name}`);
    yield fileSystem.saveImageTemporal(file, req.user._id);
    res.json({
        ok: true,
        file: file.name,
    });
}));
postRoutes.get("/image/:userId/:img", (req, res) => {
    const userId = req.params.userId;
    const img = req.params.img;
    const pathImg = fileSystem.getPhotoUrl(userId, img);
    res.sendFile(pathImg);
});
exports.default = postRoutes;
