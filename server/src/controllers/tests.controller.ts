import { Result } from '@modelsresult.model';
import { Test } from '@modelstests.model';
import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';

const getTests = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId } = req.query;

    const tests = await Test.find({ course: courseId }, 'title questions');

    res.status(200).json({
      success: true,
      tests,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTest = async (req: express.Request, res: express.Response) => {
  try {
    const { testId, studentId } = req.query;

    const checkResultTest = await Result.find({ testId, studentId });

    if (checkResultTest.length > 0) {
      return res.status(200).json({
        success: true,
        testCompleted: true,
      });
    }

    const test = await Test.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(testId as string),
        },
      },
      {
        $project: {
          'questions.answers.isCorrect': 0,
          __v: 0,
          _id: 0,
          course: 0,
          date_create: 0,
        },
      },
    ]).exec();

    res.status(200).json({
      success: true,
      test: test[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getResultsTests = async (req: express.Request, res: express.Response) => {
  try {
    const { studentId, courseId } = req.query;
    const teacherMode = req.query.teacherMode || false;
    let results: any[] = [];

    if (teacherMode) {
      results = await Result.aggregate([
        {
          $match: {
            courseId: new mongoose.Types.ObjectId(courseId as string),
          },
        },
        {
          $lookup: {
            from: 'tests',
            localField: 'testId',
            foreignField: '_id',
            as: 'testDetails',
          },
        },
        {
          $unwind: '$testDetails',
        },
        {
          $lookup: {
            from: 'users',
            localField: 'studentId',
            foreignField: '_id',
            as: 'userInfo',
          },
        },
        {
          $unwind: {
            path: '$userInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            testId: 1,
            student: '$userInfo.login',
            title: '$testDetails.title',
            totalCorrectAnswers: 1,
            totalQuestions: 1,
            questions: {
              $map: {
                input: '$questions',
                as: 'question',
                in: {
                  $let: {
                    vars: {
                      testQuestion: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$testDetails.questions',
                              as: 'testQuestion',
                              cond: { $eq: ['$$testQuestion._id', '$$question._id'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: {
                      _id: '$$question._id',
                      title: '$$testQuestion.title',
                      type: '$$question.type',
                      questionIsCorrectResult: '$$question.questionIsCorrectResult',
                      answers: {
                        $map: {
                          input: '$$question.answers',
                          as: 'answer',
                          in: {
                            _id: '$$answer._id',
                            isChoose: '$$answer.isChoose',
                            isCorrect: '$$answer.isCorrect',
                            text: {
                              $let: {
                                vars: {
                                  testAnswer: {
                                    $arrayElemAt: [
                                      {
                                        $filter: {
                                          input: '$$testQuestion.answers',
                                          as: 'testAnswer',
                                          cond: { $eq: ['$$testAnswer._id', '$$answer._id'] },
                                        },
                                      },
                                      0,
                                    ],
                                  },
                                },
                                in: '$$testAnswer.text',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          $group: {
            _id: '$testId',
            results: { $push: '$$ROOT' },
          },
        },
        {
          $lookup: {
            from: 'tests',
            localField: '_id',
            foreignField: '_id',
            as: 'testInfo',
          },
        },
        {
          $unwind: '$testInfo',
        },
        {
          $project: {
            _id: 0,
            title: '$testInfo.title',
            results: 1,
          },
        },
      ]);
    } else {
      results = await Result.aggregate([
        {
          $match: {
            courseId: new mongoose.Types.ObjectId(courseId as string),
          },
        },
        {
          $lookup: {
            from: 'tests',
            localField: 'testId',
            foreignField: '_id',
            as: 'testDetails',
          },
        },
        {
          $unwind: '$testDetails',
        },
        {
          $project: {
            _id: 1,
            testId: 1,
            title: '$testDetails.title',
            totalQuestions: 1,
            totalCorrectAnswers: 1,
            questions: {
              $map: {
                input: '$questions',
                as: 'question',
                in: {
                  $let: {
                    vars: {
                      testQuestion: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$testDetails.questions',
                              as: 'testQuestion',
                              cond: { $eq: ['$$testQuestion._id', '$$question._id'] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: {
                      _id: '$$question._id',
                      title: '$$testQuestion.title',
                      type: '$$question.type',
                      questionIsCorrectResult: '$$question.questionIsCorrectResult',
                      answers: {
                        $map: {
                          input: '$$question.answers',
                          as: 'answer',
                          in: {
                            _id: '$$answer._id',
                            isChoose: '$$answer.isChoose',
                            isCorrect: '$$answer.isCorrect',
                            text: {
                              $let: {
                                vars: {
                                  testAnswer: {
                                    $arrayElemAt: [
                                      {
                                        $filter: {
                                          input: '$$testQuestion.answers',
                                          as: 'testAnswer',
                                          cond: { $eq: ['$$testAnswer._id', '$$answer._id'] },
                                        },
                                      },
                                      0,
                                    ],
                                  },
                                },
                                in: '$$testAnswer.text',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ]);
    }

    res.status(200).json({
      success: true,
      results,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

interface TypedStructure {
  [key: string]: number | number[];
}

const saveResultTest = async (req: express.Request, res: express.Response) => {
  try {
    const { testId, userId, courseId } = req.query;
    const {
      result,
    }: {
      result: TypedStructure;
    } = req.body;

    const answers = await Test.findById(testId, 'questions');
    let totalQuestions = 0;
    let totalCorrectAnswers = 0;

    const resultObj = answers.questions.map(
      (
        question: { type: 'single' | 'multiple'; _id: string; answers: { isCorrect: boolean; _id: string }[] },
        iQuestion: number,
      ) => {
        totalQuestions++;
        if (question.type === 'single') {
          if (!Array.isArray(result[iQuestion])) {
            const singleResult = result[iQuestion];
            const indexCorrectAnswer = question.answers.findIndex((answer) => answer.isCorrect);
            const mapAnswers = question.answers.map((answer, iAnswer) => ({
              _id: answer._id,
              isChoose: singleResult === iAnswer,
              isCorrect: indexCorrectAnswer === iAnswer,
            }));

            if (result[iQuestion] === indexCorrectAnswer) totalCorrectAnswers++;

            return {
              _id: question._id,
              type: question.type,
              questionIsCorrectResult: indexCorrectAnswer === singleResult,
              answers: mapAnswers,
            };
          }
        }
        if (question.type === 'multiple') {
          if (Array.isArray(result[iQuestion])) {
            const indexArrayCorrectAnswer = question.answers.reduce(
              (acc, answer, i) => (answer.isCorrect ? [...acc, i] : acc),
              [] as number[],
            );
            const arrayResult = result[iQuestion] as ArrayLike<number>;
            const mapAnswers = question.answers.map((answer, iAnswer) => ({
              _id: answer._id,
              isChoose: _.indexOf(arrayResult, iAnswer) >= 0,
              isCorrect: _.indexOf(indexArrayCorrectAnswer, iAnswer) >= 0,
            }));

            if (_.isEqual(result[iQuestion], indexArrayCorrectAnswer)) totalCorrectAnswers++;

            return {
              _id: question._id,
              type: question.type,
              questionIsCorrectResult: _.isEqual(result[iQuestion], indexArrayCorrectAnswer),
              answers: mapAnswers,
            };
          }
        }
      },
    );

    await Result.create({
      questions: resultObj,
      testId,
      studentId: userId,
      courseId,
      totalQuestions,
      totalCorrectAnswers,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createTests = async (req: express.Request, res: express.Response) => {
  try {
    const tests = req.body;
    await Test.create(tests);

    res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTests = async (req: express.Request, res: express.Response) => {
  try {
    const {
      tests,
      deleteList,
    }: {
      tests: {
        _id: string;
        title: string;
        questions: { type: string; title: string; answers: { text: string; isCorrect: boolean }[] }[];
      }[];
      deleteList: number[];
    } = req.body;

    if (deleteList.length) {
      await Test.deleteMany({ _id: { $in: deleteList } });
    }

    for (let test of tests) {
      const { questions } = await Test.findById(test._id, 'questions');
      const refactorTest = {
        title: test.title,
        questions: test.questions.map((question, i) => ({
          ...question,
          answers: question.answers.map((answer, iAnswer) => ({
            ...answer,
            _id: questions[i].answers[iAnswer]._id,
          })),
          _id: questions[i]._id,
        })),
      };
      await Test.findOneAndUpdate({ _id: test._id }, { $set: refactorTest }, { $unset: { _id: 1 } });
    }

    res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const testController = {
  getTests,
  getTest,
  createTests,
  updateTests,
  getResultsTests,
  saveResultTest,
};
