import { FileUpload } from "../types/file-upload";
import path from "path";
import fs from "fs";
import uniqid from "uniqid";

export default class FileSystem {
  constructor() {}
  saveImageTemporal(file: FileUpload, userId: string) {
    return new Promise((resolve, reject) => {
      // Create path
      const path = this.createUserPath(userId);
      // Create file name
      const fileName = this.generateFileName(file.name);
      // Move the file from temp to our folder
      file.mv(`${path}/${fileName}`, (err: any) => {
        if (err) {
          // Can not move
          reject(err);
        } else {
          // Moved
          resolve("ok");
        }
      });
    });
  }
  private generateFileName(originalName: string) {
    // my-image.png
    const nameArr = originalName.split(".");
    const extension = nameArr[nameArr.length - 1];
    const idUnique = uniqid();
    return `${idUnique}.${extension}`;
  }
  private createUserPath(userId: string) {
    const pathUser = path.resolve(__dirname, "../uploads/", userId);
    const pathUserTemp = pathUser + "/temp";
    const exists = fs.existsSync(pathUser);
    if (!exists) {
      fs.mkdirSync(pathUser);
      fs.mkdirSync(pathUserTemp);
    }
    return pathUserTemp;
  }
}
