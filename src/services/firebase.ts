// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbdCCUsU2c8JV_8IGsXoRDHvHkR_uXgjE",
  authDomain: "thestartupview.firebaseapp.com",
  projectId: "thestartupview",
  storageBucket: "thestartupview.firebasestorage.app",
  messagingSenderId: "1089441557632",
  appId: "1:1089441557632:web:f9e3ab1ef5cd4cbf65ca65",
  measurementId: "G-RP802LP035",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
