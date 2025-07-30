"use client";

import React from "react";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToggleSlider from "@/components/ToggleSlider";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext"; // <-- Impor hook useAuth
import { db } from "@/firebase"; // <-- Impor database Firestore
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type UserData = {
  fullName: string;
  email: string;
  major: string;
  careerInterest: string[];
  notificationPreference?: {
    email: boolean;
    loker: boolean;
    training: boolean;
    community: boolean;
  };
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  // Efek untuk mengambil data dari Firestore saat pengguna login
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
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

  // Handling Notification Preference Changes
  const [notificationPref, setNotificationPref] = useState({
    email: true,
    loker: true,
    training: true,
    community: true,
  });

  useEffect(() => {
    if (userData && userData.notificationPreference) {
      setNotificationPref(userData.notificationPreference);
    }
  }, []); //empty array: only once

  const savePreferences = async (newPrefs: typeof notificationPref) => {
    if (!user) {
      console.error(
        "User belum log in. Preferensi notifikasi tidak bisa diubah."
      );
      return;
    }
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      notificationPreference: newPrefs,
    });
  };

  const handleToggle = (type: keyof typeof notificationPref) => {
    setNotificationPref((prev) => {
      const updated = { ...prev, [type]: !prev[type] };
      savePreferences(updated);
      return updated;
    });
  };

  return (
    <main>
      <Header
        isLoggedIn={true}
        pageName="profile"
        userName={userData?.fullName}
      />
      <div className={styles.main}>
        <div className={styles.MyProfile}>Profil Saya</div>
        <div className="mb-6">Kelola informasi pribadi dan preferensi anda</div>
        <div className={styles.profileCard}>
          <button
            className={styles.editButton}
            onClick={() => {
              const btn = document.getElementById("myButton");
              btn?.classList.add("clicked");
              setTimeout(() => router.push("/profile/edit"), 200);
            }}
          >
            <div className="flex flex-row align-center justify-center gap-3">
              <div>
                <img
                  src="/profile-icons/pen.png"
                  className="h-[25px] w-[25px]"
                />
              </div>
              <div className="font-bold text-[14px]">Edit Profil</div>
            </div>
          </button>

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

          <div className={styles.profileContent}>
            <img
              src="/profile-icons/name-icon.png"
              className={styles.profileIcons}
            />
            <div>
              <div>Nama Lengkap</div>
              <div className={styles.profileSection}>{userData?.fullName}</div>
            </div>
          </div>

          <div className={styles.profileContent}>
            <img
              src="/profile-icons/mail.png"
              className={styles.profileIcons}
            />
            <div>
              <div>Email</div>
              <div className={styles.profileSection}>{userData?.email}</div>
            </div>
          </div>

          <div className={styles.profileContent}>
            <img
              src="/profile-icons/jurusan-minat.png"
              className={styles.profileIcons}
            />
            <div>
              <div>Jurusan</div>
              <div className={styles.profileSection}>{userData?.major}</div>
            </div>
          </div>

          <div className={styles.profileContent}>
            <img
              src="/profile-icons/jurusan-minat.png"
              className={styles.profileIcons}
            />
            <div>
              <div>Minat Karir</div>
              <div className={styles.profileSection}>
                {userData?.careerInterest != undefined &&
                userData?.careerInterest.length > 0
                  ? userData?.careerInterest.join(", ")
                  : "Belum ada data minat karir. Silakan edit profil anda untuk menambahkan."}
              </div>
            </div>
          </div>
        </div>
        <div className="p-8"></div>

        {/* Notification Settings */}
        <div className={styles.profileCard}>
          <div className={styles.profileSection}>Saluran Notifikasi</div>
          <div className="pb-8 pt-2">
            Pilih cara Anda ingin menerima notifikasi
          </div>

          <div className={styles.toggleContainer}>
            <div className={styles.profileContent}>
              <img
                src="/profile-icons/mail.png"
                className={styles.profileIcons}
              />
              <div>
                <div className={styles.profileSection}>Notifikasi Email</div>
                <div>Terima Notifikasi melalui email</div>
              </div>
            </div>
            <ToggleSlider
              value={notificationPref.email}
              onToggle={() => handleToggle("email")}
            />
          </div>
        </div>
        <div className="p-8"> </div>
        <div className={styles.profileCard}>
          <div className={styles.profileSection}>Jenis Notifikasi</div>
          <div className="pb-8 pt-2"> Pilih jenis notifikasi yang ingin anda terima</div>

          <div className={styles.toggleContainer}>            
            <div>
              <div className={styles.profileSection}>Notifikasi Lowongan Kerja</div>
              <div>Lowongan kerja yang sesuai dengan profil anda</div>
            </div>            
            <ToggleSlider
              value={notificationPref.loker}
              onToggle={() => handleToggle("loker")}
            />
          </div>

          <div className={styles.toggleContainer}>            
            <div>
              <div className={styles.profileSection}>Notifikasi Kursus dan Pelatihan </div>
              <div>Informasi  kursus dan pelatihan  yang sesuai dengan profil anda</div>
            </div>            
            <ToggleSlider
              value={notificationPref.training}
              onToggle={() => handleToggle("training")}
            />
          </div>

          <div className={styles.toggleContainer}>            
            <div>
              <div className={styles.profileSection}>Notifikasi  Komunitas</div>
              <div>Update diskusi dan reply dari komunitas</div>
            </div>            
            <ToggleSlider
              value={notificationPref.community}
              onToggle={() => handleToggle("community")}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
