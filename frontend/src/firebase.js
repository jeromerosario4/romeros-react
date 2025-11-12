// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDYXdwQp3pwSrl8Pvv2gMjSA6lsFZMQ7HY",
  authDomain: "romeros-kingdom.firebaseapp.com",
  projectId: "romeros-kingdom",
  storageBucket: "romeros-kingdom.firebasestorage.app",
  messagingSenderId: "724001311783",
  appId: "1:724001311783:web:310dc14ec1f6b39789d202"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Debug check
console.log("Firebase App:", app.name); // should log [DEFAULT]
console.log("Auth instance:", auth);
