// src/components/SignUpForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
// PERBAIKAN: Impor fungsi sendEmailVerification
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // Impor dari file konfigurasi kita
import styles from "./SignUpForm.module.css";

type SignUpFormProps = { onSuccess: () => void };

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    major: "",
    termsAccepted: false,
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const skillOptions = [
    "Design",
    "Coding",
    "Management",
    "Marketing",
    "Accounting",
    "Data Analyst",
    "Relation",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const checkedValue = isCheckbox
      ? (e.target as HTMLInputElement).checked
      : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? checkedValue : value,
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validasi frontend
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.major
    ) {
      setError("Semua kolom wajib diisi.");
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      setIsLoading(false);
      return;
    }
    if (selectedSkills.length === 0) {
      setError("Pilih minimal satu skill.");
      setIsLoading(false);
      return;
    }
    if (!formData.termsAccepted) {
      setError("Anda harus menyetujui Syarat & Ketentuan.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Buat pengguna baru di Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // PERBAIKAN: Kirim email verifikasi ke pengguna yang baru dibuat
      await sendEmailVerification(user);

      // 2. Simpan data tambahan ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        major: formData.major,
        skills: selectedSkills,
      });

      // 3. Jika berhasil, panggil onSuccess untuk menampilkan pesan sukses
      // Anda bisa mengubah pesan di komponen SuccessAlert menjadi "Pendaftaran berhasil, silakan cek email Anda untuk verifikasi."
      onSuccess();
    } catch (error: any) {
      // Tangani error dari Firebase
      if (error.code === "auth/email-already-in-use") {
        setError("Email ini sudah terdaftar.");
      } else if (error.code === "auth/weak-password") {
        setError("Password terlalu lemah. Minimal 6 karakter.");
      } else {
        setError("Terjadi kesalahan. Coba lagi nanti.");
      }
      console.error("Error signing up:", error);
    } finally {
      setIsLoading(false); // Hentikan loading
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>DAFTAR AKUN PATHERA</h1>
      <p className={styles.subtitle}>Mohon lengkapi formulir di bawah ini.</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nama Lengkap</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Masukkan Nama Anda"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Masukkan E-mail Anda"
            className={styles.input}
          />
        </div>
        <div className={styles.passwordGroup}>
          <div>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan Password"
              className={styles.input}
            />
          </div>
          <div>
            <label className={styles.label}>Ulangi Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Konfirmasi Password"
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Jurusan</label>
          <select
            name="major"
            value={formData.major}
            onChange={handleChange}
            className={`${styles.select} ${
              !formData.major ? styles.selectPlaceholder : ""
            }`}
          >
            <option value="" disabled>
              Pilih Jurusan Anda
            </option>
            {/* Daftar jurusan yang sudah disamakan */}
            <option value="Teknik Informatika">Teknik Informatika</option>
            <option value="Sistem Informasi">Sistem Informasi</option>
            <option value="Teknik Komputer">Teknik Komputer</option>
            <option value="Ilmu Komputer">Ilmu Komputer</option>
            <option value="Manajemen">Manajemen</option>
            <option value="Akuntansi">Akuntansi</option>
            <option value="Ekonomi">Ekonomi</option>
            <option value="Matematika">Matematika</option>
            <option value="Psikologi">Psikologi</option>
            <option value="Komunikasi">Komunikasi</option>
            <option value="Desain Grafis">Desain Grafis</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Skill</label>
          <div className={styles.skillContainer}>
            {skillOptions.map((skill) => (
              <button
                type="button"
                key={skill}
                onClick={() => handleSkillToggle(skill)}
                className={`${styles.skillButton} ${
                  selectedSkills.includes(skill) ? styles.skillButtonActive : ""
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
          />
          <span>
            Dengan mendaftar, Anda menyetujui <a href="#">Syarat & Ketentuan</a>{" "}
            serta <a href="#">Kebijakan Privasi</a> kami.
          </span>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Mendaftarkan..." : "DAFTAR"}
        </button>
      </form>
      <p className={styles.loginLink}>
        Sudah Punya Akun? <Link href="/login">Masuk</Link>
      </p>
    </div>
  );
}
