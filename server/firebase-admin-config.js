import path from "path";
import dotenv from "dotenv";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
const firebaseConfig = {
  credential: cert({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_ID.replace(/\\n/g, '\n'),
  }),
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
