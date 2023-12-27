import express from 'express';

import helmet from 'helmet';
import cors from 'cors';

import cookieParser from 'cookie-parser';

import { coreAuthRouter } from '@routes/sign.routes';
import { coreApiRouter } from '@routes/app.routers';
import { developmentErrors, notFound } from '@handlers/errorHandlers';
import path from 'path';
import { isValidToken } from '@controllerscoreControllers/signin.controller';

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', coreAuthRouter);
app.use('/api', isValidToken, coreApiRouter);

app.use(notFound);
app.use(developmentErrors);

export default app;
