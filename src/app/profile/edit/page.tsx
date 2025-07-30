"use client";

import React from "react";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SuccessUpdateAlert from "@/components/SuccessUpdateAlert";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { useState, useEffect } from "react";
import Link from 'next/link';

type UserData = {
  fullName: string;
  email: string;
  major: string;
  careerInterest: string[];
};

export default function ProfilePage() {
  const db = getFirestore();
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState("");
  const [careerInterest, setCareerInterest] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  const [showSuccess, setShowSuccess] = useState(false) //state untuk alert
  const majorOptions = [
    "Teknik Komputer",
    "Komunikasi",
    "Akuntansi",
    "Psikologi",
    "Sistem Informasi",
    "Ilmu Komputer",
    "Manajemen",
    "Ekonomi",
    "Matematika",
    "Desain Grafis"
  ];
  const skillOptions = [
    "Accounting", "Android", "Artificial Intelligence", "Cloud Computing",
    "Communication Skills", "Cybersecurity", "Excel", "Graphic Design",
    "HR", "iOS", "Java", "JavaScript", "Machine Learning", "Marketing",
    "Math", "Network", "Networking", "OOP", "Power BI", "Presentation Skills",
    "Project Management", "Python", "SEO", "Social Media", "SQL",
    "Statistics", "Web Development"
  ];
  const careerOptions = [
    "Data Analyst",
    "QA Tester",
    "Backend Developer",
    "Copywriter",
    "Auditor",
    "Social Media Strategist",
    "Public Relations",
    "Tax Consulting Relations",
    "Financial Analyst",
    "HR Generalist",
    "Career Counselor",
    "User Researcher",
  ];

  // Efek untuk mengambil data dari Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        // Membuat referensi ke dokumen pengguna di Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Jika dokumen ada, simpan datanya ke state
          setUserData(userDoc.data() as UserData);
        } else {
          console.log("No such document!");
          alert("User data not found.");
        }
      }
    };

    fetchUserData();
  }, [user]); // Jalankan efek ini setiap kali 'user' berubah

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const handleCareerToggle = (career: string) => {
    setCareerInterest((prev) =>
      prev.includes(career)
        ? prev.filter((c) => c !== career)
        : [...prev, career]
    );
  };

  async function updateProfile(formData: FormData) {
    if (!user) return;

    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const major = formData.get("major") as string;

    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
      fullName,
      email,
      major,
      careerInterest,
    });

    // alert("Profile updated!");
    setShowSuccess(true);
  }

  return (
    <main>
      {showSuccess && <SuccessUpdateAlert />}
      <Header pageName="profile" />
      <div className={styles.main}>
        <div className={styles.MyProfile}>Edit Profil</div>
        <div className="mb-6">Kelola informasi pribadi dan preferensi anda</div>
        <div className={styles.profileCard}>
          <div className={styles.profileContent}>
            <img
              src="/profile-icons/user-circle.png"
              className={styles.profileIcons}
            />
            <div>
              <div className={styles.profileSection}>Informasi Pribadi</div>
              <div>Update informasi dasar profil anda</div>
            </div>
          </div>

          {/* Form edit profil */}
          <form action={updateProfile}>
            <div className={styles.profileContainer}>
              <div className={styles.editContainer}>
                <div className={styles.profileSection}>Nama Lengkap</div>
                <input
                  type="text"
                  name="fullName"
                  className={styles.inputField}
                  placeholder="Masukkan nama lengkap"
                  defaultValue={userData?.fullName || ""}
                />
              </div>
              <div className={styles.profileContent}>
                <div className={styles.editContainer}>
                  <div className={styles.profileSection}>Email</div>
                  <input
                    type="text"
                    name="email"
                    className={styles.inputField}
                    placeholder="Masukkan email"
                    defaultValue={userData?.email || ""}
                  />
                </div>
              </div>
            </div>

            <div className={styles.editContainer}>
              <div className={styles.profileSection}>Jurusan</div>
              <select
                name="major"
                defaultValue={userData?.major || ""}
                className={styles.inputField}
              >
                <option value={userData?.major || ""}>Pilih Jurusan</option>
                {majorOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="pb-6"></div>

            <div className={styles.editContainer}>
              <div className={styles.profileSection}>Minat Karir</div>
              <div className="pb-4"></div>
              <div className={styles.careerContainer}>
                {careerOptions.map((career) => (
                  <button
                    type="button"
                    key={career}
                    onClick={() => handleCareerToggle(career)}
                    className={`${styles.careerButton} ${
                      careerInterest.includes(career)
                        ? styles.careerButtonActive
                        : ""
                    }`}
                  >
                    {career}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.profileContainer}>
              <button type="submit" className={styles.submitButton}>
                <img
                  src="/profile-icons/save-change.png"
                  className={styles.otherIcons}
                />
                Simpan Perubahan
              </button>

              <Link href="/profile" className={styles.batal}>
                <img
                  src="/profile-icons/cross.png"
                  className={styles.otherIcons}
                />
                Batal
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}
