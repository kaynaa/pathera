// src/components/Features.tsx
import Image from "next/image"; // Impor komponen Image
import styles from "./Features.module.css";
import Link from "next/link";

// PERBAIKAN: Menggunakan path gambar sebagai string untuk ikon
const featureData = [
  {
    icon: "/certif.png", // Path ke ikon baru Anda
    title: "Training & Certification",
    description:
      "Ikuti berbagai pelatihan untuk dapat menunjang karir Anda dari berbagai platform terpercaya.",
    href: "/training-certification",
  },
  {
    icon: "/career.png", // Path ke ikon baru Anda
    title: "Career Path Prediction",
    description:
      "Cari tahu karir yang cocok sesuai dengan minat ataupun jurusan Anda.",
    href: "/career",
  },
  {
    icon: "/space.png", // Path ke ikon baru Anda
    title: "Community Space",
    description:
      "Interaksi dan bertukar informasi bersama pengguna lain dari seluruh dunia.",
    href: "/community-space",
  },
];

export default function Features() {
  return (
    <section className={styles.features}>
      <h2 className={styles.title}>Jelajahi Lebih</h2>
      <p className={styles.subtitle}>
        Tiga fitur utama yang akan membantu Anda menemukan jalur karier yang
        tepat.
      </p>
      <div className={styles.cardContainer}>
        {featureData.map((feature, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.cardContent}>
              {/* PERBAIKAN: Menggunakan komponen Image untuk menampilkan ikon */}
              <Image
                src={feature.icon}
                alt={`${feature.title} icon`}
                width={64}
                height={64}
                className={styles.icon}
              />
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
            <Link href={feature.href} className={styles.cardLink}>
              Selengkapnya
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
