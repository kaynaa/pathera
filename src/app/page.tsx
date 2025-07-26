// src/app/page.tsx
"use client";

import { useState } from "react";
// import Header from "@/components/Header"; // <-- Dimatikan sementara, tunggu buatan Kayna
import HeroGuest from "@/components/HeroGuest";
import HeroUser from "@/components/HeroUser";
import Features from "@/components/Features";
import ContactForm from "@/components/ContactForm";
// import Footer from "@/components/Footer"; // <-- Dimatikan sementara, tunggu buatan Kayna
import styles from "./page.module.css";

export default function HomePage() {
  // Ganti nilai ini menjadi `true` untuk melihat tampilan setelah login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userName = "Amel Putri"; // Contoh nama pengguna

  return (
    <div className={styles.pageContainer}>
      {/* Tombol simulasi untuk development, bisa dihapus nanti */}
      <button
        onClick={() => setIsLoggedIn(!isLoggedIn)}
        className={styles.devToggleButton}
      >
        Toggle Login State
      </button>

      {/* <Header isLoggedIn={isLoggedIn} userName={userName} /> */}

      <main>
        {isLoggedIn ? <HeroUser userName={userName} /> : <HeroGuest />}
        <Features />
        <ContactForm />
      </main>

      {/* <Footer /> */}
    </div>
  );
}
