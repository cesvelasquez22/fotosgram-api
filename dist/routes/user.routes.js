"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const userRoutes = (0, express_1.Router)();
userRoutes.get("/", (req, res) => {
    res.json({
        ok: true,
        message: "Everything is ok",
    });
});
userRoutes.post("/", (req, res) => {
    const { body } = req;
    const user = {
        name: body.name,
        email: body.email,
        password: body.password,
        avatar: body.avatar,
    };
    user_model_1.User.create(user).then((userDB) => {
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
exports.default = userRoutes;
