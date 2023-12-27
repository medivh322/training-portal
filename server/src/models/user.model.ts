import mongoose, { Types } from 'mongoose';
import { boolean } from 'yup';

const userSchema = new mongoose.Schema({
  login: String,
  password: String,
  isLoggen: {
    type: Boolean,
    default: false,
  },
  courses: {
    type: [Types.ObjectId],
    default: [],
  },
  role: {
    type: String,
    default: 'Student',
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export { User };
