const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
});
