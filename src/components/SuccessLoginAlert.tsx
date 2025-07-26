// src/components/SuccessLoginAlert.tsx
import styles from "./SuccessLoginAlert.module.css";
import { Check } from "lucide-react";

export default function SuccessLoginAlert() {
  return (
    <div className={styles.overlay}>
      <div className={styles.alertBox}>
        <div className={styles.iconContainer}>
          <Check size={48} strokeWidth={3} />
        </div>
        <h2 className={styles.message}>Selamat Anda Berhasil Login</h2>
      </div>
    </div>
  );
}
