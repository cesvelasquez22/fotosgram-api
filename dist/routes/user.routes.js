"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const auth_1 = require("../middlewares/auth");
const userRoutes = (0, express_1.Router)();
userRoutes.get("/", (req, res) => {
    res.json({
        ok: true,
        message: "Everything is ok",
    });
});
// Login
userRoutes.post("/login", (req, res) => {
    const body = req.body;
    user_model_1.User.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: "User / password are incorrect",
            });
        }
        if (userDB.comparePassword(body.password)) {
            const token = token_1.default.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar,
            });
            res.json({
                ok: true,
                token,
            });
        }
        else {
            return res.json({
                ok: false,
                message: "User / password are incorrect",
            });
        }
    });
});
userRoutes.post("/", (req, res) => {
    const { body } = req;
    // Encrypt password
    const password = bcrypt_1.default.hashSync(body.password, 10);
    const user = {
        name: body.name,
        email: body.email,
        password,
        avatar: body.avatar,
    };
    user_model_1.User.create(user)
        .then((userDB) => {
        const token = token_1.default.getJwtToken({
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
userRoutes.put("/", auth_1.verifyToken, (req, res) => {
    const { body } = req;
    const currentUser = req.user;
    const user = {
        name: body.name || currentUser.name,
        email: body.email || currentUser.email,
        avatar: body.avatar || currentUser.avatar,
    };
    user_model_1.User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: "User not found",
            });
        }
        const token = token_1.default.getJwtToken({
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
exports.default = userRoutes;
