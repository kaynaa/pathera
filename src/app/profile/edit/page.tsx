"use client";

import React from "react";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext"; 
import { db } from "@/firebase"; 
import { useState, useEffect } from "react";

type UserData = {
  fullName: string;
  email: string;
  major: string;
  careerInterest: string[];
};

export default function ProfilePage() {
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

            <div className={styles.profileContainer}>
                <div className={styles.editContainer}>
                    <div className={styles.profileSection}>Nama Lengkap</div>
                    <input
                        type="text"
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
                            className={styles.inputField}
                            placeholder="Masukkan email"
                            defaultValue={userData?.email || ""}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.editContainer}>
                <div className={styles.profileSection}>Jurusan</div>
                <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Masukkan jurusan"
                    defaultValue={userData?.major || ""}
                />
            </div>
            
            <div className={styles.editContainer}>
                <div className={styles.profileSection}>Minat Karir</div>
                <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Masukkan jurusan"
                    defaultValue={userData?.major || ""}
                />
            </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
