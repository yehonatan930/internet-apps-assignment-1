const express = require("express");
const mongoose = require("mongoose");
const { postSchema } = require("../schemas/post.schema");
const router = express.Router();

const Post = mongoose.model("Post", postSchema);

// Get a Post by ID
app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });
    res.json(updatedPost);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating post", error: err.message });
  }
}); 

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
