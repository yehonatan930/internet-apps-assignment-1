const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const postsController = require("./controllers/post.controller");
const commentsController = require("./controllers/comment.controller");

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Environment variables
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT;

// MongoDB Connection
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Use the postsController router for the '/api/posts' route
app.use("/posts", postsController);
app.use("/comments", commentsController);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
