// src/app/signup/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import SignUpForm from "@/components/SignUpForm";
import SuccessAlert from "@/components/SuccessAlert";
import styles from "./page.module.css"; // <-- Impor style

export default function SignUpPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  // Jika sukses, tampilkan alert
  if (isSuccess) {
    return <SuccessAlert />;
  }

  // Tampilan utama
  return (
    <main className={styles.main}>
      <div className={styles.signupCard}>
        {/* Kolom Kiri: Form */}
        <div className={styles.formSection}>
          <SignUpForm onSuccess={() => setIsSuccess(true)} />
        </div>

        {/* Kolom Kanan: Ilustrasi */}
        <div className={styles.illustrationSection}>
          <Image
            src="/signup-illustration.png" // Gambar ilustrasi Anda
            alt="Sign Up Illustration"
            width={400}
            height={400}
          />
        </div>
      </div>
    </main>
  );
}
