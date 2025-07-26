// src/components/SuccessAlert.tsx
import Link from "next/link";
import styles from "./SuccessAlert.module.css";
import { Check } from "lucide-react";

export default function SuccessAlert() {
  return (
    // PERBAIKAN: Menggunakan div sebagai overlay, bukan <main>
    <div className={styles.overlay}>
      <div className={styles.alertCard}>
        <div className={styles.iconContainer}>
          <Check size={40} strokeWidth={4} />
        </div>
        <h1 className={styles.title}>Account berhasil dibuat</h1>
        <Link href="/login" className={styles.loginButton}>
          Silahkan Login
        </Link>
      </div>
    </div>
  );
}
