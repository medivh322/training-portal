import mongoose, { Schema, Types } from 'mongoose';

const fileSchema = new Schema(
  {
    filename: String,
    metadata: {
      courseId: Types.ObjectId,
      url: String,
    },
  },
  { strict: false },
);

const File = mongoose.models.File || mongoose.model('File', fileSchema, 'uploads.files');

export { File };
