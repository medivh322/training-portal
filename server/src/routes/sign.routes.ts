import express from 'express';
import { catchErrors } from '@handlerserrorHandlers';
import { signin } from '@controllerscoreControllers/signin.controller';
import { auth, signup } from '@controllerscoreControllers/signup.contoller';

const router = express.Router();

router.get('/auth', catchErrors(auth));

router.post('/login', catchErrors(signin));
router.post('/registration', catchErrors(signup));

export { router as coreAuthRouter };
