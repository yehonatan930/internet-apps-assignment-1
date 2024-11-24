const express = require("express");
const mongoose = require("mongoose");
const { postSchema } = require("../schemas/post.schema");
const router = express.Router();

const Post = mongoose.model("Post", postSchema);

// Create a new post
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating post", error: err.message });
  }
});

module.exports = router;
