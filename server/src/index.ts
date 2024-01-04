import mongoose, { mongo } from 'mongoose';
import app from './app';
import dotenv from 'dotenv';

import { env } from '@helpers/';

dotenv.config({ path: `${__dirname}/.env` });

mongoose.connect(env('DATABASE'));
mongoose.connection.on('error', (error: any) => {
  console.log(`1. 🔥 Commun Error caused issue → : check your .env file first and add your mongodb url`);
  console.error(`🚫 Error → : ${error.message}`);
});

export let GridFSBucket: mongoose.mongo.GridFSBucket;
mongoose.connection.once('open', () => {
  GridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads',
  });
});
const port = parseInt(env('PORT'), 10);
app.listen(port, () => {
  console.log(`Express running → On PORT : ${port}`);
});
