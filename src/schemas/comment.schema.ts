import mongoose from 'mongoose';

export const commentSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  postId: { type: Number, ref: "Post", required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
});
