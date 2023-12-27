import mongoose, { mongo } from 'mongoose';
import app from './app';
import dotenv from 'dotenv';
import { GridFsStorage } from 'multer-gridfs-storage';

import { env } from '@helpers/';

dotenv.config({ path: `${__dirname}/.env` });

mongoose.connect(env('DATABASE'));
mongoose.connection.on('error', (error: any) => {
  console.log(`1. 🔥 Commun Error caused issue → : check your .env file first and add your mongodb url`);
  console.error(`🚫 Error → : ${error.message}`);
});

const port = parseInt(env('PORT'), 10);
app.listen(port, () => {
  console.log(`Express running → On PORT : ${port}`);
});
