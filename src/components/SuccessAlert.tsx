// src/components/SuccessAlert.tsx
import Link from "next/link";
import styles from "./SuccessAlert.module.css";

export default function SuccessAlert() {
  return (
    <main className={styles.main}>
      <div className={styles.iconContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={styles.icon}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h1 className={styles.title}>Account berhasil dibuat</h1>
      <Link href="/login" className={styles.loginButton}>
        Silahkan Login
      </Link>
    </main>
  );
}
