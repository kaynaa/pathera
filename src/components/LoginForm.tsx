// src/components/LoginForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth"; // Impor fungsi login
import { auth } from "../firebase"; // Impor dari file konfigurasi kita
import styles from "./LoginForm.module.css";
import { Eye, EyeOff } from "lucide-react";

type LoginFormProps = {
  onSuccess: () => void;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State untuk loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validasi frontend
    if (!email || !password) {
      setError("Email dan Password wajib diisi.");
      setIsLoading(false);
      return;
    }

    try {
      // PERBAIKAN: Memanggil fungsi login dari Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // Jika tidak ada error, berarti login berhasil
      onSuccess();
    } catch (error: any) {
      // Tangani error dari Firebase
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setError("Email atau password yang Anda masukkan salah.");
      } else {
        setError("Terjadi kesalahan. Coba lagi nanti.");
      }
      console.error("Error signing in:", error);
    } finally {
      setIsLoading(false); // Hentikan loading
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>SELAMAT DATANG KEMBALI</h1>
      <p className={styles.subtitle}>Masukkan email dan password anda</p>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan E-mail Anda"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan Password Anda"
              className={styles.input}
            />
            <button
              type="button"
              className={styles.togglePasswordButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {/* PERBAIKAN: Tombol sekarang memiliki state loading */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "LOGIN"}
        </button>
      </form>

      <p className={styles.signupLink}>
        Tidak Punya Akun? <Link href="/signup">Daftar Disini</Link>
      </p>
    </div>
  );
}
