"use client";

import React from "react";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SuccessUpdateAlert from "@/components/SuccessUpdateAlert";
// Import Image dari Next.js
import Image from "next/image";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase"; // Kita akan gunakan db yang sudah diimpor ini
import { useState, useEffect } from "react";
import Link from "next/link";

type UserData = {
  fullName: string;
  email: string;
  major: string;
  careerInterest: string[];
};

export default function ProfilePage() {
  const { user, isLoading: authIsLoading } = useAuth(); // Ganti nama isLoading agar tidak konflik
  const [userData, setUserData] = useState<UserData | null>(null);
  const [careerInterest, setCareerInterest] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false); // State untuk loading saat update
  const [showSuccess, setShowSuccess] = useState(false);

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
    "Desain Grafis",
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

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          // Inisialisasi careerInterest dari data user jika ada
          if (data.careerInterest) {
            setCareerInterest(data.careerInterest);
          }
        } else {
          console.log("No such document!");
          alert("User data not found.");
        }
      }
    };

    if (!authIsLoading) {
      fetchUserData();
    }
  }, [user, authIsLoading]);

  if (authIsLoading || !userData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const handleCareerToggle = (career: string) => {
    setCareerInterest((prev) =>
      prev.includes(career)
        ? prev.filter((c) => c !== career)
        : [...prev, career]
    );
  };

  async function updateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setIsUpdating(true);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const major = formData.get("major") as string;

    const userRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userRef, {
        fullName,
        email,
        major,
        careerInterest,
      });
      setShowSuccess(true);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Gagal memperbarui profil.");
    } finally {
      setIsUpdating(false);
    }
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
            <Image
              src="/profile-icons/user-circle.png"
              alt="Ikon Informasi Pribadi"
              width={40}
              height={40}
              className={styles.profileIcons}
            />
            <div>
              <div className={styles.profileSection}>Informasi Pribadi</div>
              <div>Update informasi dasar profil anda</div>
            </div>
          </div>

          <form onSubmit={updateProfile}>
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
                    type="email"
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
                <option value="" disabled>
                  Pilih Jurusan
                </option>
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
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isUpdating}
              >
                <Image
                  src="/profile-icons/save-change.png"
                  alt="Simpan"
                  width={20}
                  height={20}
                  className={styles.otherIcons}
                />
                {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
              </button>

              <Link href="/profile" className={styles.batal}>
                <Image
                  src="/profile-icons/cross.png"
                  alt="Batal"
                  width={20}
                  height={20}
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
