// src/app/about-us/page.tsx
"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

// PERBAIKAN: imgSrc disesuaikan dengan nama file Anda
const teamMembers = [
  {
    name: "Salsabila Azzahra",
    role: "Digital Marketing",
    imgSrc: "/team/SalsabiaAzzahra.jpeg",
  },
  { name: "Tan Triesia", role: "Digital Marketing", imgSrc: "/team/Tan.jpg" },
  {
    name: "Rahel Veralda H",
    role: "Product Management",
    imgSrc: "/team/Rahel.jpg",
  },
  {
    name: "Seline Loewel",
    role: "Product Management",
    imgSrc: "/team/Seline.jpg",
  },
  {
    name: "Devina Damayanti",
    role: "Machine Learning Ops",
    imgSrc: "/team/Devina.jpg",
  },
  // Catatan: Gambar untuk Salsabila Khoirun Nisa tidak ada di daftar Anda, jadi saya beri placeholder
  {
    name: "Salsabila Khoirun Nisa",
    role: "Machine Learning Ops",
    imgSrc: "/team/SalsabilaKhoirun.JPG",
  },
  {
    name: "Eni Sulistyo Rini",
    role: "Front-End Engineering",
    imgSrc: "/team/Eni.jpg",
  },
  {
    name: "Kayna Mufidah",
    role: "Front-End Engineering",
    imgSrc: "/team/Kayna.JPG",
  },
  { name: "Indy Khusnayaeni", role: "UI/UX Design", imgSrc: "/team/indy.jpg" },
  {
    name: "Raihanah Zakiyah",
    role: "UI/UX Design",
    imgSrc: "/team/Raihana.jpg",
  },
];

export default function AboutUsPage() {
  return (
    <>
      <Header pageName="about-us" />
      <main className={styles.main}>
        <h1 className={styles.title}>
          People Behind <strong>PATHERA</strong>
        </h1>
        <div className={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <div key={index} className={styles.memberCard}>
              <div className={styles.imageContainer}>
                <Image
                  src={member.imgSrc}
                  alt={`Foto ${member.name}`}
                  width={150}
                  height={200}
                  className={styles.memberImage}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/150x150/E2E8F0/64748B?text=Foto";
                  }}
                />
              </div>
              <p className={styles.memberName}>{member.name}</p>
              <p className={styles.memberRole}>{member.role}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
