import mongoose, { Schema, Types } from 'mongoose';

const articleSchema = new Schema({
  name: String,
  text: String,
  teacherId: mongoose.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);

export { Article };
