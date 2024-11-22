const express = require("express");
const mongoose = require("mongoose");
const { postSchema } = require("../schemas/post.schema");
const router = express.Router();

const Post = mongoose.model("Post", postSchema);

module.exports = router;
