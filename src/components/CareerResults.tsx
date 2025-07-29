// src/components/CareerResults.tsx
import { PredictionResult } from "@/app/career/page";
import styles from "./CareerResults.module.css";

type CareerResultsProps = {
  result: PredictionResult;
  selectedInterests: string[];
  onBack: () => void;
};

// Fungsi bantuan untuk memformat daftar minat
const formatInterests = (interests: string[]): string => {
  if (interests.length === 0) {
    return "minat Anda";
  }
  if (interests.length === 1) {
    return interests[0];
  }
  if (interests.length === 2) {
    return interests.join(" dan ");
  }
  const lastInterest = interests[interests.length - 1];
  const otherInterests = interests.slice(0, -1).join(", ");
  return `${otherInterests}, dan ${lastInterest}`;
};

// PERBAIKAN: Fungsi translateDescription dihapus

export default function CareerResults({
  result,
  selectedInterests,
  onBack,
}: CareerResultsProps) {
  const interestsText = formatInterests(selectedInterests);
  const skillsText = result.skills.join(", ");

  return (
    <div className={styles.resultsContainer}>
      <button onClick={onBack} className={styles.backButton}>
        &larr; Kembali
      </button>

      <h1 className={styles.title}>Jalur Karir yang Cocok untuk Anda</h1>
      <p className={styles.subtitle}>
        Berdasarkan jurusan <strong>{result.query_major}</strong> dan minat pada{" "}
        <strong>{interestsText}</strong>
      </p>

      <div className={styles.mainCard}>
        <h2 className={styles.jobTitle}>{result.predicted_job_title}</h2>
        {/* PERBAIKAN: Menampilkan deskripsi asli dari JSON */}
        <p className={styles.jobDescription}>{result.job_description}</p>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>⭐ Skills yang Dibutuhkan</h3>
          <p className={styles.skillText}>
            <em>{skillsText}</em>
          </p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            🎓 Rekomendasi pelatihan untuk kamu
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

        <button className={styles.saveButton}>Simpan</button>
      </div>
    </div>
  );
}
