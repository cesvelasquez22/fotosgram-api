"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const server = new server_1.default();
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
server.app.use("/users", user_routes_1.default);
server.app.use("/posts", post_routes_1.default);
// Connect to database
mongoose_1.default.connect("mongodb://localhost:27017/fotosgram", {}, (err) => {
    if (err)
        throw err;
    console.log("Database online");
});
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
