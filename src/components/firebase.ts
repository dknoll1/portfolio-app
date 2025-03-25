// Cursor/portfolio-app/src/lib/firebase.ts
// Initializes Firebase and exports Firestore instance for managing project data

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration object
// Replace these values with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBqUgNEsZcZ8ha-h8_IhODUR51kTyxURuo",
  authDomain: "portfolio-app-7bc58.firebaseapp.com",
  projectId: "portfolio-app-7bc58",
  storageBucket: "portfolio-app-7bc58.firebasestorage.app",
  messagingSenderId: "84336573439",
  appId: "1:84336573439:web:0dcf5eef2bbd15162845ca",
  measurementId: "G-1PWN7QHQ2F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app); 