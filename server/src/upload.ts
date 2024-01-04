import { env } from '@helpersindex';
import mongoose from 'mongoose';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

const storage = new GridFsStorage({
  url: 'mongodb://127.0.0.1:27017/learn',
  file: (req, file) => {
    const { courseId } = req.params;
    return {
      filename: file.originalname,
      bucketName: 'uploads', // Используйте имя для коллекции
      metadata: {
        courseId: new mongoose.Types.ObjectId(courseId as string),
        url: req.protocol + '://' + req.get('host') + '/api/download/file/',
      },
    };
  },
});
const upload = multer({ storage: storage });

export { upload };
