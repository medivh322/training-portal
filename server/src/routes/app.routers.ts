import express from 'express';
import { env } from '@helpersindex';
import jwt from 'jsonwebtoken';
import { IUser } from 'src/types';
import { User } from '@modelsuser.model';
import { File } from '@modelsfiles.model';
import { testController } from '@controllerstests.controller';
import { courseController } from '@controllerscourse.controller';
import { upload } from 'src/upload';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/role', async (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.cookies;

    const { id } = <IUser>jwt.verify(token, env('JWT_SECRET'));

    const { role } = await User.findById(id).select('role');

    res.status(200).json({
      success: true,
      role,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post('/courses', courseController.createCourse);
router.post('/courses/members', courseController.setCourseMembers);
router.get('/courses/all', courseController.getAllCourses);
router.get('/courses/all/student', courseController.getAllCoursesForStudent);
router.get('/courses/s/members', courseController.searchAllMembers);
router.get('/courses/members', courseController.getCourseMembers);

router.get('/tests', testController.getTests);
router.get('/tests/results', testController.getResultsTests);
router.post('/tests', testController.createTests);
router.put('/tests', testController.updateTests);

router.get('/test', testController.getTest);
router.post('/test/r/save', testController.saveResultTest);

router.post('/upload', upload.single('file'), (req, res) => {
  res.send('Файл успешно загружен');
});
router.get('/files', async (req, res) => {
  try {
    const { courseId } = req.query;

    const perPage = 2;
    const page = (req.query.page as string) || '1';
    console.log(perPage * parseInt(page, 10) - perPage);
    const files = await File.find({ 'metadata.courseId': new mongoose.Types.ObjectId(courseId as string) }, 'filename')
      .skip(perPage * Number(page) - perPage)
      .limit(perPage);

    res.status(200).json({
      success: true,
      files,
      totalCount: files.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.get('/file/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const downloadStream = bucket.openDownloadStreamByName(filename);

    downloadStream.pipe(res).on('error', (err) => {
      res.status(404).send('Файл не найден');
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export { router as coreApiRouter };
