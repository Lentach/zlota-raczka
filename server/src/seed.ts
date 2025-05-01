import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zlota-raczka';

const seedAdmin = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Połączono z MongoDB');

    const adminUser = new User({
      username: 'admin',
      password: 'admin123'
    });

    await adminUser.save();
    console.log('Utworzono użytkownika admina');
    process.exit(0);
  } catch (error) {
    console.error('Błąd podczas seedowania:', error);
    process.exit(1);
  }
};

seedAdmin(); 