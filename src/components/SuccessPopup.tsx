// src/components/SuccessPopup.tsx
import styles from "./SuccessPopup.module.css";
import { Check } from "lucide-react";

type SuccessPopupProps = {
  message: string;
};

export default function SuccessPopup({ message }: SuccessPopupProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popupBox}>
        <div className={styles.iconContainer}>
          <Check size={48} strokeWidth={3} />
        </div>
        <h2 className={styles.message}>{message}</h2>
      </div>
    </div>
  );
}
