// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Ganti dengan konfigurasi dari proyek Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyD1MLaIYH-HdEeMA9fNu0O0jXX4t6AmNGM",
  authDomain: "pathera-app.firebaseapp.com",
  projectId: "pathera-app",
  storageBucket: "pathera-app.firebasestorage.app",
  messagingSenderId: "681184708456",
  appId: "1:681184708456:web:680fdbd68673352a7438dd",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor layanan yang akan kita gunakan di komponen lain
export const auth = getAuth(app);
export const db = getFirestore(app);
