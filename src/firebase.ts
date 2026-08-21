import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAIbzDCdRCPYClorQVWQgraSyThWGEAKO8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "darshanaa-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "darshanaa-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "darshanaa-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "102264124018",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:102264124018:web:64073004cb22f81a4488eb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-R4R2CJTQ5P"
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
