// src/components/CareerResults.tsx
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore"; // <-- Impor updateDoc
import { PredictionResult } from "@/app/career/page";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase"; // <-- Impor db
import styles from "./CareerResults.module.css";
import Image from "next/image";

type CareerResultsProps = {
  result: PredictionResult;
  selectedInterests: string[];
  onBack: () => void;
  isInitiallySaved: boolean; // Prop baru untuk status awal
};

const formatInterests = (interests: string[]): string => {
  if (interests.length === 0) return "minat Anda";
  if (interests.length === 1) return interests[0];
  if (interests.length === 2) return interests.join(" dan ");
  const lastInterest = interests[interests.length - 1];
  const otherInterests = interests.slice(0, -1).join(", ");
  return `${otherInterests}, dan ${lastInterest}`;
};

export default function CareerResults({
  result,
  selectedInterests,
  onBack,
  isInitiallySaved,
}: CareerResultsProps) {
  const { user } = useAuth();
  const [saveError, setSaveError] = useState("");
  const [isSaved, setIsSaved] = useState(isInitiallySaved);

  const handleSave = async () => {
    if (!user) {
      setSaveError(
        "Silahkan Login Terlebih Dahulu Dapat Menyimpan Hasil Prediksi"
      );
      return;
    }

    try {
      // PERBAIKAN: Menyimpan data ke Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        savedCareer: result, // Menyimpan seluruh objek hasil prediksi
      });

      setSaveError("");
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving career result:", error);
      setSaveError("Gagal menyimpan hasil. Coba lagi.");
    }
  };

  const interestsText = formatInterests(selectedInterests);
  const skillsText = result.skills.join(", ");

  return (
    <div className={styles.resultsContainer}>
      {!isSaved && (
        <button onClick={onBack} className={styles.backButton}>
          &larr; Kembali
        </button>
      )}

      <h1 className={styles.title}>Jalur Karir yang Cocok untuk Anda</h1>

      {isSaved ? (
        <p className={styles.subtitle}>
          Berikut adalah jalur karier yang paling sesuai dengan profil Anda.
        </p>
      ) : (
        <p className={styles.subtitle}>
          Berdasarkan jurusan <strong>{result.query_major}</strong> dan minat
          pada <strong>{interestsText}</strong>
        </p>
      )}

      {isSaved && (
        <button onClick={onBack} className={styles.tryAnotherButton}>
          Coba prediksi karir lainnya
        </button>
      )}

      {saveError && !isSaved && (
        <div className={styles.saveError}>{saveError}</div>
      )}

      <div className={styles.mainCard}>
        <h2 className={styles.jobTitle}>{result.predicted_job_title}</h2>
        <p className={styles.jobDescription}>{result.job_description}</p>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>⭐ Skills yang Dibutuhkan</h3>
          <p className={styles.skillText}>
            <em>{skillsText}</em>
          </p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitleWithIcon}>
            <Image
              src="/Reko-pelatihan.png"
              alt="Rekomendasi Pelatihan"
              width={24}
              height={24}
            />
            <span>Rekomendasi pelatihan untuk kamu</span>
          </h3>
          <div className={styles.courseGrid}>
            {result.recommended_courses.map((course, index) => (
              <a
                href={course.link}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.courseCard}
              >
                <div className={styles.courseImage}></div>
                <div className={styles.courseContent}>
                  <h4 className={styles.courseTitle}>{course.title}</h4>
                  <p className={styles.courseOrg}>{course.organization}</p>
                  <div className={styles.courseDetails}>
                    <span>⭐ {course.rating}</span>
                    <span>{course.difficulty}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {!isSaved && (
          <button className={styles.saveButton} onClick={handleSave}>
            Simpan
          </button>
        )}
      </div>
    </div>
  );
}
