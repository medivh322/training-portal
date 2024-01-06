import mongoose, { Types } from 'mongoose';
import { boolean } from 'yup';
import { File } from '@modelsfiles.model';

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

// testSchema.pre('deleteMany', async function () {
//   const tests = await this.model.find(this.getQuery());

//   if (tests.length) {
//     for (const test of tests) {
//       await File.deleteOne({ 'metadata.courseId': new mongoose.Types.ObjectId(test._id as string) });
//     }
//   }
// });

const Test = mongoose.models.Test || mongoose.model('Test', testSchema);

export { Test };
