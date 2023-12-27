import * as yup from 'yup';
import bcrypt from 'bcryptjs';
import { env } from '@helpers/';
import { User } from '@modelsuser.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
import express, { Request } from 'express';
import { IUser } from 'src/types';

const signin = async (req: express.Request, res: express.Response) => {
  try {
    const { login, password } = req.body;

    const ObjectSchema = yup.object({
      login: yup.string().required('Пожалуйста, введите логин'),
      password: yup.string().required('Пожалуйста, введите пароль'),
    });

    await ObjectSchema.validate({ login, password }).catch((error) => {
      return res.status(400).json({
        success: false,
        message: error,
      });
    });

    const user: any = await User.findOne({ login });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Пользователя с таким логином не существует',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Неверные логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      env('JWT_SECRET'),
      { expiresIn: '24h' },
    );

    await User.findByIdAndUpdate(user._id, { isLoggen: true });

    res
      .status(200)
      .cookie('token', token, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
      })
      .json({
        success: true,
        id: user._id,
        role: user.role,
      });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const isValidToken = async (req: Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Не найден токен, нужна повторная авторизация',
      });
    }

    const verifed = <IUser>jwt.verify(token, env('JWT_SECRET'));

    if (!verifed) {
      return res.status(401).json({
        success: false,
        message: 'Токен не прошел верификацию, нужна повторная авторизация',
      });
    }

    if (verifed.id) (req as any).userId = verifed.id;
    next();
  } catch (error: any) {
    res.status(503).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

export { signin, isValidToken };
