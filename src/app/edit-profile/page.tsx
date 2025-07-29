"use client";

import React from "react";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext"; // <-- Impor hook useAuth
import { db } from "@/firebase"; // <-- Impor database Firestore
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type UserData = {
  fullName: string;
  email: string;
  major: string;
  careerInterest: string[];
};

export default function ProfilePage() {

  const router = useRouter();
    const { user, isLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  // Efek untuk mengambil data dari Firestore saat pengguna login
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

  // Menampilkan pesan loading saat AuthContext sedang memeriksa status login
  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <main>
      <Header isLoggedIn={true} pageName="profile" userName={userData?.fullName} />

      {/* Profile Card */}
      <div className={styles.main}>
        <div className={styles.MyProfile}>Edit Profil</div>
        <div className="mb-6">Kelola informasi pribadi dan preferensi anda</div>
        <div className={styles.profileCard}>
            <div className={styles.profileContent}>
                <img src="/profile-icons/user-circle.png" className={styles.profileIcons} />
                <div>
                    <div className={styles.profileSection}>Informasi Pribadi</div>
                    <div>Update informasi dasar profil anda</div>
                </div>
            </div>

            <div className={styles.profileContent}>
                <img src="/profile-icons/name-icon.png" className={styles.profileIcons} />
                <div>
                    <div>Nama Lengkap</div>
                    <div className={styles.profileSection}>{userData?.fullName}</div>
                </div>
            </div>

            <div className={styles.profileContent}>
                <img src="/profile-icons/mail.png" className={styles.profileIcons} />
                <div>
                    <div>Email</div>
                    <div className={styles.profileSection}>{userData?.email}</div>
                </div>
            </div>

            <div className={styles.profileContent}>
                <img src="/profile-icons/jurusan-minat.png" className={styles.profileIcons} />
                <div>
                    <div>Jurusan</div>
                    <div className={styles.profileSection}>{userData?.major}</div>
                </div>
            </div>

            <div className={styles.profileContent}>
                <img src="/profile-icons/jurusan-minat.png" className={styles.profileIcons} />
                <div>
                    <div>Minat Karir</div>
                    <div className={styles.profileSection}>
                        {userData?.careerInterest != undefined && userData?.careerInterest.length > 0 ? (
                            userData?.careerInterest.join(", ")
                        ) : (
                            "Belum ada data minat karir. Silakan edit profil anda untuk menambahkan."
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <Footer />

      
    
    </main>
  );
}
