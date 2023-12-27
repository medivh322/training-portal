import mongoose, { Types } from 'mongoose';
import { boolean } from 'yup';

const courseSchema = new mongoose.Schema({
  title: String,
  teacherId: Types.ObjectId,
});

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

export { Course };
