import Server from "./classes/server";
import userRoutes from "./routes/user.routes";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postRoutes from "./routes/post.routes";

const server = new Server();

// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

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
