import express from 'express';
import mongoose from 'mongoose';
import { File } from '@modelsfiles.model';
import { GridFSBucket } from 'src';
import mime from 'mime';
import { User } from '@modelsuser.model';
import { IUser } from 'src/types';
import { env } from '@helpersindex';
import jwt from 'jsonwebtoken';

const getFiles = async (req: express.Request, res: express.Response) => {
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
};

const downloadFile = async (req: express.Request, res: express.Response) => {
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
};

const getRole = async (req: express.Request, res: express.Response) => {
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
};

export const commonController = { getFiles, downloadFile, getRole };
