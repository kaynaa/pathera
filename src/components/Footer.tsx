import Link from "next/link";
import styles from "./Footer.module.css";
import React from "react";
import { Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <div className={styles.footer}>
        <div className= {styles.footerContainer}>
            <div className="flex justify-start items-center gap-0">
                <img
                    src="/white-logo.png"
                    alt="Pathera Logo"
                    className={styles.logo}
                />
                <div className={styles.footerTitle}>Temukan Jalur Karir Impianmu</div>
            </div>
            <div className={styles.footerTitle}>Fitur</div>
            <div className={styles.footerTitle}>Dukungan</div>
            <div className={styles.footerTitle}>Media Sosial Kami</div>    

        </div>

      <div className={styles.footerTextContainer}>
        <div className={styles.footerText}>
            <div className="pl-[20px] pr-[100px]">
                Manfaatkan prediksi karir, rekomendasi pelatihan bersertifikat,
                komunitas eksklusif, dan notifikasi personal untuk langkah karir yang
                tepat.
            </div>
        </div>
        <div className={styles.footerText}>
          <Link href="/training-certification">Training and Certification</Link>
          <Link href="/career">Career Prediction</Link>
          <Link href="/community">Community Space</Link>
        </div>

        <div className={styles.footerText}>
          <Link href="https://www.instagram.com/ristek.csui/">Kontak</Link>
          <Link href="/about-us">Tentang Kami</Link>
        </div>

        <div className={styles.footerIcons}>
          <Link href="https://www.instagram.com/ristek.csui/">
            <Instagram />
          </Link>
          <Link href="https://www.linkedin.com/company/ristek-fakultas-ilmu-komputer-universitas-indonesia/">
            <Linkedin />
          </Link>
        </div>
      </div>

      <div className={styles.line}></div>
      <div className={styles.copyright}>@ 2025 Pathera. Copyright</div>
    </div>
  );
}
