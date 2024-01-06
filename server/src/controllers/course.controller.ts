import { Course } from '@modelscourses.model';
import { User } from '@modelsuser.model';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { env } from '@helpersindex';
import { IUser } from 'src/types';

const createCourse = async (req: express.Request, res: express.Response) => {
  try {
    const { title, teacherId } = req.body;

    await Course.create({
      title,
      teacherId,
    });

    res.status(200).json({
      success: true,
      message: 'Курс успешно создан',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Не удалось создать курс',
    });
  }
};

const deleteCourse = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId } = req.query;

    await Course.deleteOne({ _id: new mongoose.Types.ObjectId(courseId as string) });

    res.status(200).json({
      success: true,
      message: 'курс успешно удален',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'не удалось удалить курс',
    });
  }
};

const getAllCourses = async (req: express.Request, res: express.Response) => {
  try {
    const teacherId = req.query.teacherId as string;
    const courses = await Course.find({ teacherId: new mongoose.Types.ObjectId(teacherId) }, 'title');
    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllCoursesForStudent = async (req: express.Request, res: express.Response) => {
  try {
    const studentId = req.query.studentId as string;
    const courses = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(studentId) },
      },
      {
        $lookup: {
          from: 'courses',
          let: {
            courses: '$courses',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $in: ['$_id', '$$courses'],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                label: '$title',
                value: '$_id',
                _id: 0,
              },
            },
          ],
          as: 'courses',
        },
      },
      {
        $project: {
          courses: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      courses: courses[0].courses,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchAllMembers = async (req: express.Request, res: express.Response) => {
  try {
    const { query, courseId } = req.query;

    const members = await User.aggregate([
      {
        $match: { login: { $regex: query, $options: 'i' } },
      },
      {
        $lookup: {
          from: 'courses',
          let: {
            courses: '$courses',
            role: '$role',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$$role', 'Student'],
                    },
                    {
                      $not: {
                        $in: [new mongoose.Types.ObjectId(courseId as string), '$$courses'],
                      },
                    },
                  ],
                },
              },
            },
          ],
          as: 'matching',
        },
      },
      {
        $match: {
          matching: { $ne: [] },
        },
      },
      {
        $project: {
          name: '$login',
          key: '$_id',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      members,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

const setCourseMembers = async (req: express.Request, res: express.Response) => {
  try {
    const { membersArray, courseId } = req.body;

    await User.updateOne(
      { _id: { $in: membersArray } },
      {
        $addToSet: {
          courses: courseId,
        },
      },
    );

    res.status(200).json({
      success: true,
      message: 'пользователь был успешно добавлен в исполнители задачи',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

const getCourseMembers = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId } = req.query;

    const members = await User.find(
      {
        courses: { $in: new mongoose.Types.ObjectId(courseId as string) },
        role: 'Student',
      },
      {
        key: '$_id',
        name: '$login',
      },
    );

    res.status(200).json({
      success: true,
      members,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

const searchCourses = async (req: express.Request, res: express.Response) => {
  try {
    const { query } = req.query;
    const token = req.cookies.token;
    const settingsUser = <IUser>jwt.verify(token, env('JWT_SECRET'));
    let courses = [];

    if (settingsUser.role === 'Teacher') {
      courses = await Course.find({
        teacherId: new mongoose.Types.ObjectId(settingsUser.id),
        title: { $regex: query, $options: 'i' },
      });
    } else {
      courses = await User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(settingsUser.id),
          },
        },
        {
          $lookup: {
            from: 'courses',
            let: {
              courses: '$courses',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $in: ['$_id', '$$courses'],
                      },
                      {
                        $regexMatch: {
                          input: '$title',
                          regex: query,
                          options: 'i',
                        },
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  label: '$title',
                  value: '$_id',
                  _id: 0,
                },
              },
            ],
            as: 'courses',
          },
        },
        {
          $project: {
            _id: 0,
            courses: 1,
          },
        },
      ]);
    }

    res.status(200).json({
      success: true,
      courses: courses[0].courses,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

export const courseController = {
  getAllCourses,
  createCourse,
  deleteCourse,
  searchAllMembers,
  setCourseMembers,
  getCourseMembers,
  getAllCoursesForStudent,
  searchCourses,
};
