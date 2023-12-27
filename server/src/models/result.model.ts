import mongoose, { Types } from 'mongoose';
import { string } from 'yup';

const resultSchema = new mongoose.Schema({
  testId: Types.ObjectId,
  studentId: Types.ObjectId,
  courseId: Types.ObjectId,
  totalQuestions: Number,
  totalCorrectAnswers: Number,
  questions: [
    {
      _id: Types.ObjectId,
      type: {
        type: String,
        enum: ['multiple', 'single'],
      },
      questionIsCorrectResult: Boolean,
      answers: [
        {
          _id: Types.ObjectId,
          isChoose: Boolean,
          isCorrect: Boolean,
        },
      ],
    },
  ],
});

const Result = mongoose.models.Result || mongoose.model('Result', resultSchema);

export { Result };
