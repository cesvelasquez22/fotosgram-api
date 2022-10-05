import Server from "./classes/server";
import userRoutes from "./routes/user.routes";
import mongoose from "mongoose";

const server = new Server();

server.app.use("/user", userRoutes);

// Connect to database
mongoose.connect("mongodb://localhost:27017/fotosgram", {}, (err) => {
  if (err) throw err;
  console.log("Database online");
});

server.start(() => {
  console.log(`Servidor corriendo en puerto ${server.port}`);
});
