import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es necesario"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  avatar: {
    type: String,
    required: false,
    default: "av-1.png",
  }
});

userSchema.method("comparePassword", function (password: string = ""): boolean {
  if (bcrypt.compareSync(password, this.password)) {
    return true;
  } else {
    return false;
  }
});

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;

  comparePassword(password: string): boolean;
}

export const User = model<IUser>("User", userSchema);
