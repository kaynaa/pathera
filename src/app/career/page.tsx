// src/app/career/page.tsx
"use client";

import { useState, useEffect } from "react";
import CareerForm from "@/components/CareerForm";
import CareerResults from "@/components/CareerResults";
import styles from "./page.module.css";

// Tipe data untuk hasil prediksi dari JSON
export type PredictionResult = {
  query_major: string;
  query_dream_job: string;
  predicted_job_title: string;
  job_description: string;
  skills: string[];
  recommended_courses: Course[];
};

export type Course = {
  title: string;
  organization: string;
  rating: number;
  skills: string;
  difficulty: string;
  duration: string;
  link: string;
};

export default function CareerPage() {
  // State untuk menyimpan semua data dari JSON
  const [allPredictions, setAllPredictions] = useState<PredictionResult[]>([]);
  // State untuk menyimpan hasil prediksi yang dipilih
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  // State untuk menyimpan minat yang dipilih untuk ditampilkan di hasil
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Mengambil data dari JSON saat halaman dimuat
  useEffect(() => {
    fetch("/final_job_course_recommendations.json")
      .then((res) => res.json())
      .then((data) => setAllPredictions(data));
  }, []);

  // Fungsi untuk mencari prediksi berdasarkan input form
  const handleSearch = (major: string, interests: string[]) => {
    // Simpan minat yang dipilih
    setSelectedInterests(interests);

    // Logika pencarian yang lebih baik
    let result = null;
    if (interests.length > 0) {
      // Cari yang cocok dengan jurusan dan salah satu minat
      result = allPredictions.find(
        (p) => p.query_major === major && interests.includes(p.query_dream_job)
      );
    }

    // Jika tidak ada hasil atau tidak ada minat yang dipilih, cari fallback
    if (!result) {
      result = allPredictions.find((p) => p.query_major === major) || null;
    }

    setPredictionResult(result);
  };

  // Fungsi untuk kembali ke form dari halaman hasil
  const handleBackToForm = () => {
    setPredictionResult(null);
  };

  return (
    <>
      {/* Header telah dihapus dari sini */}
      <main className={styles.main}>
        <div className={styles.container}>
          {predictionResult ? (
            <CareerResults
              result={predictionResult}
              selectedInterests={selectedInterests}
              onBack={handleBackToForm}
            />
          ) : (
            <CareerForm onSearch={handleSearch} />
          )}
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}
