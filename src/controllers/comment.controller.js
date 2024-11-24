const express = require("express");
const mongoose = require("mongoose");
const { postSchema } = require("../schemas/post.schema");
const router = express.Router();

const Comment = mongoose.model('Comment', commentSchema);

// Update a Comment
app.put('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const { content, author } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { content, author },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});