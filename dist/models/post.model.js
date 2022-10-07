"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.PostSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PostSchema = new mongoose_1.Schema({
    created: {
        type: Date,
    },
    message: {
        type: String,
    },
    imgs: [
        {
            type: String,
        },
    ],
    coords: {
        type: String, // -13.3232, 12.2323
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Debe existir una referencia a un usuario"],
    },
});
exports.PostSchema.pre("save", function (next) {
    this.created = new Date();
    next();
});
exports.Post = (0, mongoose_1.model)("Post", exports.PostSchema);
