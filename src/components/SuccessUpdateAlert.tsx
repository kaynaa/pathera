import styles from "./SuccessLoginAlert.module.css";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuccessLoginAlert() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/profile");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.overlay}>
      <div className={styles.alertBox}>
        <div className={styles.iconContainer}>
          <Check size={48} strokeWidth={3} />
        </div>
        <h2 className={styles.message}>Data berhasil diubah!</h2>
      </div>
    </div>
  );
}
