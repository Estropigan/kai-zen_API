import admin  from 'firebase-admin'
import dotenv from 'dotenv';

dotenv.config();

// Load Firebase service account key from environment variables
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL, // If using Realtime Database
});

const db = admin.firestore(); // Firestore instance
const auth = admin.auth(); // Firebase Authentication

export { db, auth };
