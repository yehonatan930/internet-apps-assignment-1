const postSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  sender: { type: String, required: true },
});

module.exports = { postSchema };
