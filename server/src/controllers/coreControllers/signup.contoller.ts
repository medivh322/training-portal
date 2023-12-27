import * as yup from 'yup';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import express from 'express';
import { env } from '@helpers/';
import { User } from '@modelsuser.model';

interface IUser {
  id: string;
  role: string;
}

const auth = async (req: express.Request, res: express.Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        noNotifications: true,
        message: 'Не найден токен, нужна повторная авторизация',
      });
    }

    const verifed = <IUser>jwt.verify(token, env('JWT_SECRET'));
    res.status(200).json({
      success: true,
      id: verifed.id,
      role: verifed.role,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      noNotifications: !!!req.cookies.token,
      message: req.cookies.token
        ? 'Извините, ваш токен авторизации истек или не прошел проверку. Для продолжения пожалуйста, выполните повторную авторизацию'
        : 'Необходимо пройти авторизацию',
    });
  }
};

const logout = async (req: express.Request, res: express.Response) => {
  const { id } = <IUser>jwt.verify(req.cookies.token, env('JWT_SECRET'));
  await User.findByIdAndUpdate(id, { isLoggen: false });
  res.clearCookie('token');
  res.status(200).json({
    success: false,
  });
};

const signup = async (req: express.Request, res: express.Response) => {
  try {
    const { login, password, role } = req.body;

    const ObjectSchema = yup.object({
      login: yup.string().required('Пожалуйста, введите логин'),
      password: yup.string().required('Пожалуйста, введите пароль'),
    });

    ObjectSchema.validate({ login, password }).catch((error: Error) => {
      return res.status(400).json({
        success: false,
        message: error,
      });
    });

    const checkUser = await User.findOne({ login });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким логином уже существует',
      });
    }

    const hashPassword = await bcrypt.hash(password, 3);

    await User.create({
      login,
      password: hashPassword,
      role: role,
    });

    res.status(200).json({
      success: true,
      message: 'Успешная регистрация',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error });
  }
};

export { signup, auth, logout };
