// src/components/HeroGuest.tsx
import Image from "next/image";
import styles from "./Hero.module.css";
import Link from "next/link";

export default function HeroGuest() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        {/* PERBAIKAN: Logo dipindahkan ke sini, di atas judul */}
        <Image
          src="/logo-pathera-white.png"
          alt="Pathera Logo"
          width={120}
          height={120}
          className={styles.contentLogo}
        />
        <h1 className={styles.title}>Temukan Jalur Karier Impianmu!</h1>
        <p className={styles.subtitle}>
          Panduan karier personal. Rekomendasi pelatihan dan jalur karier yang
          dipersonalisasi khusus untukmu.
        </p>
        <div className={styles.buttonGroup}>
          <Link href="/training-certification" className={styles.primaryButton}>
            Dapatkan Rekomendasi Sekarang
          </Link>
          <Link href="/career" className={styles.secondaryButton}>
            Prediksi Jalur Karir Anda
          </Link>
        </div>
      </div>
    </section>
  );
}
