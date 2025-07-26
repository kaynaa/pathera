// src/components/LoginForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./LoginForm.module.css";
import { Eye, EyeOff } from "lucide-react"; // Menggunakan ikon dari library

type LoginFormProps = {
  onSuccess: () => void;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan Password wajib diisi.");
      return;
    }

    console.log("Login attempt with:", { email, password });
    onSuccess();
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

        <button type="submit" className={styles.submitButton}>
          LOGIN
        </button>
      </form>

      <p className={styles.signupLink}>
        Tidak Punya Akun? <Link href="/signup">Daftar Disini</Link>
      </p>
    </div>
  );
}
