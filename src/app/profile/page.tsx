// src/app/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToggleSlider from "@/components/ToggleSlider";
import styles from "./page.module.css";

type UserData = {
  fullName: string;
  email: string;
  major: string;
  skills: string[]; // Mengganti nama dari careerInterest agar konsisten
  notificationPreferences?: {
    email: boolean;
    loker: boolean;
    training: boolean;
    community: boolean;
  };
};

export default function ProfilePage() {
  // PERBAIKAN: Semua hooks dipindahkan ke atas
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [notificationPref, setNotificationPref] = useState({
    email: true,
    loker: true,
    training: true,
    community: true,
  });

  // Efek untuk mengambil data dari Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          // Set preferensi notifikasi dari data yang diambil
          if (data.notificationPreferences) {
            setNotificationPref(data.notificationPreferences);
          }
        } else {
          console.log("Dokumen pengguna tidak ditemukan!");
        }
      }
    };

    if (!isLoading) {
      fetchUserData();
    }
  }, [user, isLoading]);

  // Fungsi untuk menyimpan preferensi
  const savePreferences = async (newPrefs: typeof notificationPref) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      notificationPreferences: newPrefs,
    });
  };

  // Handler untuk toggle
  const handleToggle = (type: keyof typeof notificationPref) => {
    const newPrefs = { ...notificationPref, [type]: !notificationPref[type] };
    setNotificationPref(newPrefs);
    savePreferences(newPrefs);
  };

  // Tampilan loading
  if (isLoading || !userData) {
    return <div className={styles.loading}>Memuat Profil...</div>;
  }

  return (
    <main>
      <Header pageName="profile" />
      <div className={styles.main}>
        <div className={styles.title}>Profil Saya</div>
        <div className={styles.subtitle}>
          Kelola informasi pribadi dan preferensi anda
        </div>

        {/* Kartu Informasi Pribadi */}
        <div className={styles.profileCard}>
          <button
            className={styles.editButton}
            onClick={() => router.push("/profile/edit")}
          >
            <Image
              src="/profile-icons/pen.png"
              alt="Edit"
              width={20}
              height={20}
            />
            <span>Edit Profil</span>
          </button>

          <div className={styles.profileContent}>
            <Image
              src="/profile-icons/user-circle.png"
              alt="User"
              width={40}
              height={40}
            />
            <div>
              <div className={styles.profileSectionTitle}>
                Informasi Pribadi
              </div>
              <div>Update informasi dasar profil anda</div>
            </div>
          </div>

          <div className={styles.infoRow}>
            <Image
              src="/profile-icons/name-icon.png"
              alt="Nama"
              width={24}
              height={24}
            />
            <div>
              <div>Nama Lengkap</div>
              <div className={styles.infoData}>{userData.fullName}</div>
            </div>
          </div>

          <div className={styles.infoRow}>
            <Image
              src="/profile-icons/mail.png"
              alt="Email"
              width={24}
              height={24}
            />
            <div>
              <div>Email</div>
              <div className={styles.infoData}>{userData.email}</div>
            </div>
          </div>

          <div className={styles.infoRow}>
            <Image
              src="/profile-icons/jurusan-minat.png"
              alt="Jurusan"
              width={24}
              height={24}
            />
            <div>
              <div>Jurusan</div>
              <div className={styles.infoData}>{userData.major || "-"}</div>
            </div>
          </div>

          <div className={styles.infoRow}>
            <Image
              src="/profile-icons/jurusan-minat.png"
              alt="Skill"
              width={24}
              height={24}
            />
            <div>
              <div>Skill</div>
              <div className={styles.infoData}>
                {userData.skills && userData.skills.length > 0
                  ? userData.skills.join(", ")
                  : "Belum ada data skill."}
              </div>
            </div>
          </div>
        </div>

        {/* Kartu Saluran Notifikasi */}
        <div className={styles.profileCard}>
          <div className={styles.profileSectionTitle}>Saluran Notifikasi</div>
          <p className={styles.cardSubtitle}>
            Pilih cara Anda ingin menerima notifikasi
          </p>
          <div className={styles.toggleContainer}>
            <div className={styles.profileContent}>
              <Image
                src="/profile-icons/mail.png"
                alt="Email Notif"
                width={40}
                height={40}
              />
              <div>
                <div className={styles.profileSectionTitle}>
                  Notifikasi Email
                </div>
                <div>Terima Notifikasi melalui email</div>
              </div>
            </div>
            <ToggleSlider
              value={notificationPref.email}
              onToggle={() => handleToggle("email")}
            />
          </div>
        </div>

        {/* Kartu Jenis Notifikasi */}
        <div className={styles.profileCard}>
          <div className={styles.profileSectionTitle}>Jenis Notifikasi</div>
          <p className={styles.cardSubtitle}>
            Pilih jenis notifikasi yang ingin anda terima
          </p>
          <div className={styles.toggleContainer}>
            <div>
              <div className={styles.profileSectionTitle}>
                Notifikasi Lowongan Kerja
              </div>
              <div>Lowongan kerja yang sesuai dengan profil anda</div>
            </div>
            <ToggleSlider
              value={notificationPref.loker}
              onToggle={() => handleToggle("loker")}
            />
          </div>
          <div className={styles.toggleContainer}>
            <div>
              <div className={styles.profileSectionTitle}>
                Notifikasi Kursus dan Pelatihan
              </div>
              <div>
                Informasi kursus dan pelatihan yang sesuai dengan profil anda
              </div>
            </div>
            <ToggleSlider
              value={notificationPref.training}
              onToggle={() => handleToggle("training")}
            />
          </div>
          <div className={styles.toggleContainer}>
            <div>
              <div className={styles.profileSectionTitle}>
                Notifikasi Komunitas
              </div>
              <div>Update diskusi dan reply dari komunitas</div>
            </div>
            <ToggleSlider
              value={notificationPref.community}
              onToggle={() => handleToggle("community")}
            />
          </div>
        </div>
      </div>
      <div className="p-8"></div>
      <Footer />
    </main>
  );
}
