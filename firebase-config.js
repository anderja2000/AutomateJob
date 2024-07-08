// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import 'dotenv/config'
// Your web app's Firebase configuration
let env = process.env;
const firebaseConfig = {
  apiKey: env.API_KEY,
  authDomain: env.AUTH_DOMAIN,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.MESSAGING_SENDER_ID,
  appId: env.APP_ID
};

console.log(firebaseConfig.apiKey, firebaseConfig.authDomain,firebaseConfig.authDomain,
firebaseConfig.projectId, firebaseConfig.storageBucket, firebaseConfig.messagingSenderId, firebaseConfig.appId);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app); 
export {db}; 