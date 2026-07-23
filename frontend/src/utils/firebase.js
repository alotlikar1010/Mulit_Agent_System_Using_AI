// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "aichatbot-17394.firebaseapp.com",
    projectId: "aichatbot-17394",
    storageBucket: "aichatbot-17394.firebasestorage.app",
    messagingSenderId: "1068238441857",
    appId: "1:1068238441857:web:d00a0db42203e12c92ec80",
    measurementId: "G-SGDMY10GH6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider()


