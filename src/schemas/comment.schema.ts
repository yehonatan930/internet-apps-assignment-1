const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  postId: { type: Number, ref: "Post", required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
});

module.exports = { commentSchema };
