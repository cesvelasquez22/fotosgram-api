import { Schema, model, Document } from "mongoose";

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

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export const User = model<IUser>("User", userSchema);
