// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5fFTpMYawFeL-QQfxgICmQUPjQLGUObc",
  authDomain: "ai-dish.firebaseapp.com",
  projectId: "ai-dish",
  storageBucket: "ai-dish.firebasestorage.app",
  messagingSenderId: "586649288979",
  appId: "1:586649288979:web:f932c82215d0902a061ae6",
  measurementId: "G-QGZNNEPSJ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
