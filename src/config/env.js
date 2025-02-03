import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
};
