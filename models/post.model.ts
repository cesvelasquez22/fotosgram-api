import { model, Schema, Document } from "mongoose";
import { IUser } from "./user.model";

export const PostSchema = new Schema({
  created: {
    type: Date,
  },
  message: {
    type: String,
  },
  img: [
    {
      type: String,
    },
  ],
  coords: {
    type: String, // -13.3232, 12.2323
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Debe existir una referencia a un usuario"],
  },
});

PostSchema.pre<IPost>("save", function (next) {
  this.created = new Date();
  next();
});

interface IPost extends Document {
  created: Date;
  message: string;
  img: string[];
  coords: string;
  user: IUser["_id"];
}

export const Post = model<IPost>("Post", PostSchema);
