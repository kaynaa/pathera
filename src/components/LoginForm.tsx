// src/components/LoginForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
// PERBAIKAN: Impor fungsi-fungsi baru dari Firebase
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Email dan Password wajib diisi.");
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (error: any) {
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
      setIsLoading(false);
    }
  };

  // PERBAIKAN: Fungsi baru untuk menangani login dengan Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Cek apakah ini pengguna baru
      const additionalInfo = getAdditionalUserInfo(result);
      if (additionalInfo?.isNewUser) {
        // Jika pengguna baru, simpan datanya ke Firestore
        await setDoc(doc(db, "users", user.uid), {
          fullName: user.displayName, // Ambil nama dari akun Google
          email: user.email,
          major: "", // Jurusan bisa diisi nanti di halaman profil
          skills: [],
        });
      }

      onSuccess(); // Panggil onSuccess untuk redirect
    } catch (error: any) {
      setError("Gagal login dengan Google. Coba lagi.");
      console.error("Google sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>SELAMAT DATANG KEMBALI</h1>
      <p className={styles.subtitle}>Masukkan email dan password anda.</p>

      {/* PERBAIKAN: Tombol Login dengan Google ditambahkan */}
      <button
        onClick={handleGoogleLogin}
        className={styles.googleButton}
        disabled={isLoading}
      >
        <img src="/google-icon.svg" alt="Google icon" width={20} height={20} />
        <span>Masuk dengan Google</span>
      </button>

      <div className={styles.divider}>
        <span>ATAU</span>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ... form email dan password tetap sama ... */}
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

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "LOGIN"}
        </button>
      </form>

      <p className={styles.signupLink}>
        Belum Punya Akun? <Link href="/signup">Daftar</Link>
      </p>
    </div>
  );
}
