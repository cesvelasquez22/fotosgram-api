import Server from "./classes/server";
import userRoutes from "./routes/user.routes";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postRoutes from "./routes/post.routes";
import fileUpload from "express-fileupload";

const server = new Server();

// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// File upload
server.app.use(fileUpload({ useTempFiles: true }));

// App routes
server.app.use("/users", userRoutes);
server.app.use("/posts", postRoutes);

// Connect to database
mongoose.connect("mongodb://localhost:27017/fotosgram", {}, (err) => {
  if (err) throw err;
  console.log("Database online");
});

server.start(() => {
  console.log(`Servidor corriendo en puerto ${server.port}`);
});
