<<<<<<< HEAD
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

  // Mengambil data dari JSON saat halaman dimuat
  useEffect(() => {
    fetch("/final_job_course_recommendations.json")
      .then((res) => res.json())
      .then((data) => setAllPredictions(data));
  }, []);

  // Fungsi untuk mencari prediksi berdasarkan input form
  const handleSearch = (major: string, interests: string[]) => {
    // Logika pencarian sederhana: cari yang cocok dengan jurusan dan minat pertama
    const result = allPredictions.find(
      (p) => p.query_major === major && interests.includes(p.query_dream_job)
    );

    if (result) {
      setPredictionResult(result);
    } else {
      // Fallback jika tidak ada yang cocok persis
      const fallbackResult = allPredictions.find(
        (p) => p.query_major === major
      );
      setPredictionResult(fallbackResult || null);
    }
  };

  // Fungsi untuk kembali ke form dari halaman hasil
  const handleBackToForm = () => {
    setPredictionResult(null);
  };

  return (
    <>
      {/* Di sini nanti bisa ditambahkan <Header /> dan <Footer /> */}
      <main className={styles.main}>
        <div className={styles.container}>
          {predictionResult ? (
            <CareerResults
              result={predictionResult}
              onBack={handleBackToForm}
            />
          ) : (
            <CareerForm onSearch={handleSearch} />
          )}
        </div>
      </main>
    </>
  );
}
=======
export default function CareerPage() {
    <div>
        <span>Career Page</span>
    </div>
}
>>>>>>> 82a60650941a6a27d9c8c8e5c6f4bc24855af687
