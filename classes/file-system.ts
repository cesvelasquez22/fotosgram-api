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

  moveTempImageToPost(userId: string) {
    const pathTemp = path.resolve(__dirname, "../uploads/", userId, "temp");
    const pathPost = path.resolve(__dirname, "../uploads/", userId, "posts");
    if (!fs.existsSync(pathTemp)) {
      return [];
    }
    if (!fs.existsSync(pathPost)) {
      fs.mkdirSync(pathPost);
    }
    const imagesTemp = this.getImagesTemp(userId);
    imagesTemp.forEach(image => {
      fs.renameSync(`${pathTemp}/${image}`, `${pathPost}/${image}`);
    });
    return imagesTemp;
  }

  private getImagesTemp(userId: string) {
    const pathTemp = path.resolve(__dirname, "../uploads/", userId, "temp");
    return fs.readdirSync(pathTemp) || [];
  }

  getPhotoUrl(userId: string, img: string) {
    // Path post
    const pathPhoto = path.resolve(__dirname, "../uploads/", userId, "posts", img);
    // If image exists
    const exists = fs.existsSync(pathPhoto);
    if (!exists) {
      return path.resolve(__dirname, "../assets/400x250.jpg");
    }
    return pathPhoto;
  }
}
