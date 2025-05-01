import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zlota-raczka';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB połączone pomyślnie.');
  } catch (error) {
    console.error('Błąd połączenia z MongoDB:', error);
    process.exit(1);
  }
}; 