// src/components/CareerResults.tsx
import Image from "next/image";
import { PredictionResult } from "@/app/career/page";
import styles from "./CareerResults.module.css";

type CareerResultsProps = {
  result: PredictionResult;
  onBack: () => void;
};

export default function CareerResults({ result, onBack }: CareerResultsProps) {
  return (
    <div className={styles.resultsContainer}>
      <button onClick={onBack} className={styles.backButton}>
        &larr; Kembali
      </button>

      <h1 className={styles.title}>Jalur Karir yang Cocok untuk Anda</h1>
      <p className={styles.subtitle}>
        Berdasarkan jurusan <strong>{result.query_major}</strong> dan minat pada{" "}
        <strong>{result.query_dream_job}</strong>
      </p>

      <div className={styles.mainCard}>
        <h2 className={styles.jobTitle}>{result.predicted_job_title}</h2>
        <p className={styles.jobDescription}>{result.job_description}</p>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>⭐ Skills yang Dibutuhkan</h3>
          <div className={styles.skillTags}>
            {result.skills.map((skill) => (
              <span key={skill} className={styles.skillTag}>
                {skill}
              </span>
            ))}
          </div>
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
