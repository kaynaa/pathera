// src/app/career/page.tsx
"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  // image_url dihapus karena tidak jadi digunakan
};

export default function CareerPage() {
  const { user, isLoading } = useAuth();
  const [allPredictions, setAllPredictions] = useState<PredictionResult[]>([]);
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  // State baru untuk menyimpan data dari Firestore
  const [savedResult, setSavedResult] = useState<PredictionResult | null>(null);

  // Mengambil data JSON
  useEffect(() => {
    fetch("/final_job_course_recommendations.json")
      .then((res) => res.json())
      .then((data) => setAllPredictions(data));
  }, []);

  // Mengambil data yang tersimpan dari Firestore saat pengguna terdeteksi
  useEffect(() => {
    const fetchSavedResult = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().savedCareer) {
          setSavedResult(userDoc.data().savedCareer);
        }
      }
    };
    if (!isLoading) {
      fetchSavedResult();
    }
  }, [user, isLoading]);

  const handleSearch = (major: string, interests: string[]) => {
    setSelectedInterests(interests);
    let result = null;
    if (interests.length > 0) {
      result = allPredictions.find(
        (p) => p.query_major === major && interests.includes(p.query_dream_job)
      );
    }
    if (!result) {
      result = allPredictions.find((p) => p.query_major === major) || null;
    }
    setPredictionResult(result);
    setSavedResult(null); // Hapus hasil lama saat mencari yang baru
  };

  const handleBackToForm = () => {
    setPredictionResult(null);
    setSavedResult(null); // Hapus juga hasil tersimpan agar form muncul
  };

  if (isLoading) {
    return <div>Loading...</div>; // Tampilan loading sederhana
  }

  return (
    <>
      <Header pageName="career" />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Logika tampilan diubah untuk menampilkan hasil tersimpan */}
          {predictionResult ? (
            <CareerResults
              result={predictionResult}
              selectedInterests={selectedInterests}
              onBack={handleBackToForm}
              isInitiallySaved={false} // Ini adalah hasil baru
            />
          ) : savedResult ? (
            <CareerResults
              result={savedResult}
              selectedInterests={[savedResult.query_dream_job]} // Ambil minat dari data tersimpan
              onBack={handleBackToForm}
              isInitiallySaved={true} // Ini adalah hasil yang sudah tersimpan
            />
          ) : (
            <>
              <h1 className={styles.pageTitle}>Career Prediction</h1>
              <p className={styles.pageSubtitle}>
                Temukan beberapa jalur karier potensial yang sesuai dengan
                jurusan dan minatmu.
              </p>
              <CareerForm onSearch={handleSearch} />
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
