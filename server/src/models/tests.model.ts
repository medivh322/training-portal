import mongoose, { Types } from 'mongoose';
import { boolean } from 'yup';

const answerSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean,
});

const questionSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ['multiple', 'single'] },
  answers: [answerSchema],
});

const testSchema = new mongoose.Schema({
  title: String,
  course: Types.ObjectId,
  questions: [questionSchema],
  date_create: {
    type: Date,
    default: Date.now,
  },
});

const Test = mongoose.models.Test || mongoose.model('Test', testSchema);

export { Test };
