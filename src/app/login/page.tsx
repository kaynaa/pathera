// src/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import SuccessLoginAlert from "@/components/SuccessLoginAlert"; // Alert baru
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLoginSuccess = () => {
    setIsSuccess(true);
  };

  // Efek untuk redirect setelah alert muncul
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push("/"); // Arahkan ke Beranda setelah 2 detik
      }, 2000);

      // Membersihkan timer jika komponen unmount
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  return (
    <>
      <main className={styles.main}>
        <div className={styles.loginCard}>
          {/* Kolom Kiri: Ilustrasi */}
          <div className={styles.illustrationSection}>
            <Image
              src="/signup-illustration.png" // Gambar ilustrasi yang sama dengan sign up
              alt="Login Illustration"
              width={400}
              height={400}
              className={styles.illustrationImage}
            />
          </div>

          {/* Kolom Kanan: Form */}
          <div className={styles.formSection}>
            <LoginForm onSuccess={handleLoginSuccess} />
          </div>
        </div>
      </main>

      {/* Alert Overlay, hanya muncul jika isSuccess true */}
      {isSuccess && <SuccessLoginAlert />}
    </>
  );
}
