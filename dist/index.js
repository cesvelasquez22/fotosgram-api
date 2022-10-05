"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const mongoose_1 = __importDefault(require("mongoose"));
const server = new server_1.default();
server.app.use("/user", user_routes_1.default);
// Connect to database
mongoose_1.default.connect("mongodb://localhost:27017/fotosgram", {}, (err) => {
    if (err)
        throw err;
    console.log("Database online");
});
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
