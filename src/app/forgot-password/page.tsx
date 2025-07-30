// src/app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import styles from "./page.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!email) {
      setError("Email wajib diisi.");
      setIsLoading(false);
      return;
    }

    try {
      // Memanggil fungsi Firebase untuk mengirim email reset
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(
        "Tautan untuk mereset password telah dikirim. Silakan periksa kotak masuk email Anda."
      );
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        setError("Email tidak terdaftar.");
      } else {
        setError("Terjadi kesalahan. Coba lagi nanti.");
      }
      console.error("Error sending password reset email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.title}>Lupa Password</h1>
        <p className={styles.subtitle}>
          Masukkan alamat email Anda yang terdaftar. Kami akan mengirimkan tautan untuk mereset password Anda.
        </p>

        {/* Form hanya muncul jika belum ada pesan sukses */}
        {!successMessage && (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan E-mail Anda"
                className={styles.input}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? "Mengirim..." : "Kirim Tautan Reset"}
            </button>
          </form>
        )}

        {/* Pesan sukses akan ditampilkan di sini */}
        {successMessage && (
          <p className={styles.success}>{successMessage}</p>
        )}

        <p className={styles.backLink}>
          <Link href="/login">Kembali ke Login</Link>
        </p>
      </div>
    </main>
  );
}
