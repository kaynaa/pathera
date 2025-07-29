"use client";

import React from "react";
import styles from "./page.module.css";
import Header from "@/components/Header";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext"; // <-- Impor hook useAuth
import { db } from "@/firebase"; // <-- Impor database Firestore
import { useRouter } from "next/navigation";

export default function ProfilePage() {

  const router = useRouter();
  return (
    <main>
      <Header isLoggedIn={true} pageName="profile" userName="User Name" />
      <div className={styles.main}>
        <div className={styles.MyProfile}>Profil Saya</div>
        <div className="mb-6">Kelola informasi pribadi dan preferensi anda</div>
        <div className={styles.profileCard}>
            <button 
                className={styles.editButton}
                onClick={() => {
                    const btn = document.getElementById("myButton");
                    btn?.classList.add("clicked");
                    setTimeout(() => router.push("/edit-profile"), 200);
                }}
            >   
            <div className="flex flex-row align-center justify-center gap-3">
                <div>
                    <img src="/profile-icons/pen.png" className="h-[25px] w-[25px]" />
                </div>
                <div>Edit Profil</div>
            </div>
            </button>

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
                    <div className={styles.profileSection}>Amel Putri</div>
                </div>
            </div>

            <div className={styles.profileContent}>
                <img src="/profile-icons/mail.png" className={styles.profileIcons} />
                <div>
                    <div>Email</div>
                    <div className={styles.profileSection}>email@gmail</div>
                </div>
            </div>

            <div className={styles.profileContent}>
                <img src="/profile-icons/jurusan-minat.png" className={styles.profileIcons} />
                <div>
                    <div>Jurusan</div>
                    <div className={styles.profileSection}>jurusan</div>
                </div>
            </div>

            <div className={styles.profileContent}>
                <img src="/profile-icons/jurusan-minat.png" className={styles.profileIcons} />
                <div>
                    <div>Minat Karir</div>
                    <div className={styles.profileSection}>karir</div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}
