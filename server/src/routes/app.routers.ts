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
import { GridFSBucket } from 'src';
import mime from 'mime-types';

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
router.get('/courses/s', courseController.searchCourses);
router.get('/courses/members', courseController.getCourseMembers);

router.get('/tests', testController.getTests);
router.get('/tests/results', testController.getResultsTests);
router.post('/tests', testController.createTests);
router.put('/tests', testController.updateTests);

router.get('/test', testController.getTest);
router.post('/test/r/save', testController.saveResultTest);

router.post('/upload/:courseId', upload.single('file'), (req, res) => {
  res.send('Файл успешно загружен');
});
router.get('/files', async (req, res) => {
  try {
    const { courseId } = req.query;

    const files = await File.find({ 'metadata.courseId': new mongoose.Types.ObjectId(courseId as string) });

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
router.get('/download/file/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new mongoose.mongo.ObjectId(id);

    const files = await GridFSBucket.find({ _id: objectId }).toArray();
    if (files.length === 0) {
      return res.status(404).json({ error: 'Файл не найден' });
    }

    const file = files[0];
    const filename = file.filename;
    const contentType = mime.lookup(filename) || 'application/octet-stream';

    res.set('Content-Type', contentType);

    const downloadStream = GridFSBucket.openDownloadStream(objectId);
    downloadStream.pipe(res);

    downloadStream.on('end', () => {
      res.end();
    });

    downloadStream.on('error', (error) => {
      console.error(error);
      res.status(500).json({ error: 'Не удалось получить файл' });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка' });
  }
});

export { router as coreApiRouter };
