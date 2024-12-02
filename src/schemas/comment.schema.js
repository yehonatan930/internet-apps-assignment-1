const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: { type: Number, ref: "Post", required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
});

module.exports = { commentSchema };
