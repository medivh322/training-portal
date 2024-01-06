import mongoose, { Types } from 'mongoose';
import { File } from '@modelsfiles.model';
import { Test } from '@modelstests.model';
import { Result } from '@modelsresult.model';
import { User } from '@modelsuser.model';

const courseSchema = new mongoose.Schema({
  title: String,
  teacherId: Types.ObjectId,
});

courseSchema.pre('deleteOne', async function () {
  await File.deleteMany({ 'metadata.courseId': new mongoose.Types.ObjectId(this.getQuery()._id as string) });
  await Test.deleteMany({ course: new mongoose.Types.ObjectId(this.getQuery()._id as string) });
  await Result.deleteMany({ courseId: new mongoose.Types.ObjectId(this.getQuery()._id as string) });
  await User.updateMany(
    { courses: { $in: [new mongoose.Types.ObjectId(this.getQuery()._id as string)] } },
    {
      $pull: {
        courses: { $in: [new mongoose.Types.ObjectId(this.getQuery()._id as string)] },
      },
    },
  );
});

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

export { Course };
