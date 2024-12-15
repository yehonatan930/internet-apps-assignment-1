import express from "express";
import mongoose, { Mongoose } from "mongoose";
import dotenv from "dotenv";
import postsController from "./controllers/post.controller";
import commentsController from "./controllers/comment.controller";
import authenticate from "./middlewares/auth.middleware";
import authController from "./controllers/auth.controller";
import usersController from "./controllers/user.controller";

dotenv.config();

export const app = express();

// Middleware to parse JSON
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(authenticate);

app.use("/auth", authController);
app.use("/posts", postsController);
app.use("/comments", commentsController);
app.use("/users", usersController);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
