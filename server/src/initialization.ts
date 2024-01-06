import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { env } from '@helpers/';
import bcrypt from 'bcryptjs';
import { User } from '@modelsuser.model';

dotenv.config({ path: `${__dirname}/.env` });

mongoose
  .connect(process.env.DATABASE || '')
  .then(async () => {
    const exists = await User.findOne({ role: 'Admin' });
    if (!exists) {
      const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || '', 3);
      const adminUser = new User({
        login: 'Admin',
        password: hashPassword,
        role: 'Admin',
      });

      await adminUser.save();
      console.log('Нулевой пользователь создан');
    } else {
      console.log('Нулевой пользователь уже существует');
    }
  })
  .catch((err) => console.error('Ошибка подключения к MongoDB:', err));
mongoose.connection.on('error', (error: any) => {
  console.log(`1. 🔥 Commun Error caused issue → : check your .env file first and add your mongodb url`);
  console.error(`🚫 Error → : ${error.message}`);
});
