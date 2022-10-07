"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    saveImageTemporal(file, userId) {
        return new Promise((resolve, reject) => {
            // Create path
            const path = this.createUserPath(userId);
            // Create file name
            const fileName = this.generateFileName(file.name);
            // Move the file from temp to our folder
            file.mv(`${path}/${fileName}`, (err) => {
                if (err) {
                    // Can not move
                    reject(err);
                }
                else {
                    // Moved
                    resolve("ok");
                }
            });
        });
    }
    generateFileName(originalName) {
        // my-image.png
        const nameArr = originalName.split(".");
        const extension = nameArr[nameArr.length - 1];
        const idUnique = (0, uniqid_1.default)();
        return `${idUnique}.${extension}`;
    }
    createUserPath(userId) {
        const pathUser = path_1.default.resolve(__dirname, "../uploads/", userId);
        const pathUserTemp = pathUser + "/temp";
        const exists = fs_1.default.existsSync(pathUser);
        if (!exists) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
}
exports.default = FileSystem;
