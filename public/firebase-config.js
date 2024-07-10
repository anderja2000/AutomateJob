import path from 'path';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';


dotenv.config({path: path.resolve(process.cwd(), '../.env')})
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

console.log("API Key:", firebaseConfig.apiKey); // For debugging

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };