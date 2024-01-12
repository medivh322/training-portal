import express from 'express';
import { testController } from '@controllerstests.controller';
import { courseController } from '@controllerscourse.controller';
import { upload } from 'src/upload';
import { commonController } from '@controllerscoreControllers/common.contoller';
import { articelsController } from '@controllersarticles.controller';

const router = express.Router();

router.post('/courses', courseController.createCourse);
router.post('/courses/members', courseController.setCourseMembers);
router.get('/courses/all', courseController.getAllCourses);
router.get('/courses/all/student', courseController.getAllCoursesForStudent);
router.get('/courses/s/members', courseController.searchAllMembers);
router.get('/courses/s', courseController.searchCourses);
router.get('/courses/members', courseController.getCourseMembers);
router.delete('/courses', courseController.deleteCourse);

router.post('/tests', testController.createTests);
router.get('/tests', testController.getTests);
router.get('/tests/results', testController.getResultsTests);
router.put('/tests', testController.updateTests);

router.post('/test/r/save', testController.saveResultTest);
router.get('/test', testController.getTest);

router.post('/upload/:courseId', upload.single('file'), (req, res) => {
  res.send('Файл успешно загружен');
});
router.get('/files', commonController.getFiles);
router.get('/download/file/:id', commonController.downloadFile);
router.get('/role', commonController.getRole);

router.post('/articles', articelsController.createArticle);
router.get('/articles', articelsController.getArticles);
router.get('/articles/:articleId', articelsController.getArticle);
router.put('/articles', articelsController.updateArticle);

export { router as coreApiRouter };
