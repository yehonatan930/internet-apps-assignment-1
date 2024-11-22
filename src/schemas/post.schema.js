const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  sender: { type: String, required: true },
});

module.exports = { postSchema };
