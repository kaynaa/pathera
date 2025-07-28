// src/components/CareerForm.tsx
"use client";

import { useState } from "react";
import styles from "./CareerForm.module.css";

type CareerFormProps = {
  onSearch: (major: string, interests: string[]) => void;
};

const interestOptions = [
  "Data Analyst",
  "Backend Developer",
  "QA Tester",
  "Social Media Strategist",
  "Public Relations",
  "Tax Consultant",
  "Copywriter",
  "Financial Analyst",
  "Auditor",
  "HR Generalist",
  "Career Counselor",
  "User Researcher",
];

export default function CareerForm({ onSearch }: CareerFormProps) {
  const [major, setMajor] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!major) {
      setError("Jurusan Wajib diisi");
      return;
    }
    setError("");
    onSearch(major, selectedInterests);
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Career Prediction</h1>
      <p className={styles.subtitle}>
        Temukan beberapa jalur karier potensial yang sesuai dengan jurusan dan
        minatmu.
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Jurusan Anda</label>
          <select
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className={`${styles.select} ${major ? styles.selected : ""}`}
          >
            <option value="" disabled>
              Pilih Jurusan Anda
            </option>
            <option value="Teknik Informatika">Teknik Informatika</option>
            <option value="Ilmu Komunikasi">Ilmu Komunikasi</option>
            <option value="Akuntansi">Akuntansi</option>
            <option value="Psikologi">Psikologi</option>
          </select>
          {error && <p className={styles.errorText}>{error}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Minat Karier Anda{" "}
            <span className={styles.labelNote}>(Bisa pilih lebih dari 1)</span>
          </label>
          {/* PERBAIKAN: Menambahkan kalimat baru */}
          <p className={styles.labelSubtext}>
            Pilih area karier yang menarik bagi Anda untuk prediksi yang lebih
            akurat
          </p>
          <div className={styles.interestGrid}>
            {interestOptions.map((interest) => (
              <button
                type="button"
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`${styles.interestButton} ${
                  selectedInterests.includes(interest) ? styles.active : ""
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          Lihat Prediksi Karier
        </button>
      </form>
    </div>
  );
}
