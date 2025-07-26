// src/components/HeroUser.tsx
import Image from "next/image";
import styles from "./Hero.module.css";

type HeroUserProps = {
  userName: string;
};

export default function HeroUser({ userName }: HeroUserProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        {/* PERBAIKAN: Logo juga ditambahkan di sini untuk konsistensi */}
        <Image
          src="/logo-pathera-white.png"
          alt="Pathera Logo"
          width={120}
          height={120}
          className={styles.contentLogo}
        />
        <h1 className={styles.title}>Selamat Datang {userName},</h1>
        <p className={styles.subtitle}>
          Pathera siap membantu Anda memecahkan dan mengembangkan karier impian
          Anda.
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.primaryButton}>
            Cek Hasil Rekomendasimu Sekarang
          </button>
          <button className={styles.secondaryButton}>
            Riwayat Karir Tersimpan
          </button>
        </div>
      </div>
    </section>
  );
}
