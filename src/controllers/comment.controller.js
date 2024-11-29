const express = require("express");
const mongoose = require("mongoose");
const { postSchema } = require("../schemas/post.schema");
const router = express.Router();

const Comment = mongoose.model("Comment", commentSchema);

// Delete a Comment
app.delete("/comments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a Comment
app.put("/comments/:id", async (req, res) => {
  const { id } = req.params;
  const { content, author } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content, author },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Comments
app.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a New Comment
app.post("/comments", async (req, res) => {
  const { postId, content, author } = req.body;

  if (!postId || !content) {
    return res.status(400).json({ error: "postId and content are required" });
  }

  try {
    const comment = new Comment({ postId, content, author });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
