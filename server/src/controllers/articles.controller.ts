import express from 'express';
import mongoose from 'mongoose';
import { File } from '@modelsfiles.model';
import { Article } from '@modelsarticle.model';

const createArticle = async (req: express.Request, res: express.Response) => {
  try {
    const { text, name, teacherId } = req.body;

    await Article.create({
      name,
      text,
      teacherId,
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

const getArticles = async (req: express.Request, res: express.Response) => {
  try {
    const articles = await Article.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: 'users',
          localField: 'teacherId',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $project: {
          author: { $arrayElemAt: ['$author.login', 0] },
          _id: 1,
          name: 1,
          createdAt: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      articles,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getArticle = async (req: express.Request, res: express.Response) => {
  try {
    const { articleId } = req.params;

    const article = await Article.findById(articleId, 'name text');

    res.status(200).json({
      success: true,
      article,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateArticle = async (req: express.Request, res: express.Response) => {
  try {
    const { articleId } = req.query;
    const { name, text } = req.body;

    await Article.updateOne(
      {
        _id: new mongoose.Types.ObjectId(articleId as string),
      },
      { name, text },
    );

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

export const articelsController = { createArticle, getArticles, updateArticle, getArticle };
