// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext"; // <-- Impor hook useAuth
import { db } from "@/firebase"; // <-- Impor database Firestore
// import Header from "@/components/Header";
import HeroGuest from "@/components/HeroGuest";
import HeroUser from "@/components/HeroUser";
import Features from "@/components/Features";
import ContactForm from "@/components/ContactForm";
// import Footer from "@/components/Footer";
import styles from "./page.module.css";

// Tipe data untuk data pengguna dari Firestore
type UserData = {
  fullName: string;
};

export default function HomePage() {
  // PERBAIKAN: Menggunakan state dari AuthContext, bukan useState lokal
  const { user, isLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  // Efek untuk mengambil data dari Firestore saat pengguna login
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        // Membuat referensi ke dokumen pengguna di Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Jika dokumen ada, simpan datanya ke state
          setUserData(userDoc.data() as UserData);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, [user]); // Jalankan efek ini setiap kali 'user' berubah

  // Menampilkan pesan loading saat AuthContext sedang memeriksa status login
  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      {/* <Header isLoggedIn={!!user} userName={userData?.fullName || ""} /> */}

      <main>
        {/* PERBAIKAN: Menampilkan komponen berdasarkan 'user' dari useAuth */}
        {user && userData ? (
          <HeroUser userName={userData.fullName} />
        ) : (
          <HeroGuest />
        )}

        <Features />
        <ContactForm />
      </main>

      {/* <Footer /> */}
    </div>
  );
}
