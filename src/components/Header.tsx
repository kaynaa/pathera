// src/components/Header.tsx
"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { Bell, CircleUserRound, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { getAuth, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

import NotificationDropdown from "./NotificationDropdown";

export interface Notification {
  id: string;
  message: string;
  link: string;
  timestamp: Timestamp;
}

interface HeaderProps {
  pageName: string;
}

type UserData = {
  fullName: string;
};

export default function Header({ pageName }: HeaderProps) {
  const { user, isLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  // State untuk dropdown profil (dari teman Anda)
  const [isProfileOpen, setProfileOpen] = useState(false);

  // State untuk dropdown notifikasi (dari Anda)
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Refs untuk mendeteksi klik di luar dropdown
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Mengambil data user
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) setUserData(userDoc.data() as UserData);
      };
      fetchUserData();
    }
  }, [user]);

  // Mengambil notifikasi (milik Anda)
  useEffect(() => {
    if (user) {
      const notificationsRef = collection(
        db,
        "users",
        user.uid,
        "notifications"
      );
      const q = query(notificationsRef, orderBy("timestamp", "desc"), limit(2));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedNotifications = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Notification)
        );
        setNotifications(fetchedNotifications);
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Menggabungkan logika untuk menutup kedua dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Menutup dropdown notifikasi
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
      // Menutup dropdown profil
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }
  const isLoggedIn = !!user;

  // Fungsi Logout (dari teman Anda)
  const auth = getAuth();
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        alert("Anda berhasil log out");
        // Arahkan ke halaman login atau home setelah logout
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Error signing out:", error);
        alert("Terjadi error saat log out");
      });
  };

  // Fungsi toggle notifikasi (dari Anda)
  const toggleNotification = () => {
    setNotificationOpen((prev) => !prev);
    setProfileOpen(false); // Tutup dropdown lain saat ini dibuka
  };

  // Fungsi toggle profil (dari teman Anda, dimodifikasi)
  const toggleProfile = () => {
    setProfileOpen((prev) => !prev);
    setNotificationOpen(false); // Tutup dropdown lain saat ini dibuka
  };

  return (
    <div className={styles.header}>
      <div className={styles.left_container}>
        <img src="/white-logo.png" alt="Pathera Logo" className={styles.logo} />
        <Link
          href="/"
          className={`${styles.nav} ${
            pageName === "home" ? styles.nav_active : ""
          }`}
        >
          Beranda
        </Link>
        <Link
          href="/career"
          className={`${styles.nav} ${
            pageName === "career" ? styles.nav_active : ""
          }`}
        >
          Career
        </Link>
        <Link
          href="/training-certification"
          className={`${styles.nav} ${
            pageName === "training" ? styles.nav_active : ""
          }`}
        >
          Training & Certification
        </Link>
        <Link
          href="/community-space"
          className={`${styles.nav} ${
            pageName === "community-space" ? styles.nav_active : ""
          }`}
        >
          Community Space
        </Link>
        <Link
          href="/about-us"
          className={`${styles.nav} ${
            pageName === "about-us" ? styles.nav_active : ""
          }`}
        >
          About Us
        </Link>
      </div>

      {/* KODE GABUNGAN UNTUK BAGIAN KANAN */}
      <div className={styles.right_container}>
        {isLoggedIn ? (
          <div className={styles.right_container}>
            {/* Dropdown Notifikasi (milik Anda) */}
            <div className={styles.notificationWrapper} ref={notificationRef}>
              <Bell
                size={25}
                fill="white"
                className={styles.icon}
                onClick={toggleNotification}
              />
              {isNotificationOpen && (
                <NotificationDropdown notifications={notifications} />
              )}
            </div>

            {/* Dropdown Profil & Logout (milik teman Anda, digabungkan) */}
            <div className={styles.dropdown} ref={profileRef}>
              <button
                className={styles.username_display}
                onClick={toggleProfile}
              >
                <CircleUserRound className="mr-4" size={25} />
                {userData?.fullName || "User"}
                <ChevronDown size={25} />
              </button>
              {isProfileOpen && (
                <div className={styles.dropdown_menu}>
                  <Link
                    href="/profile"
                    className="text-[#023047] text-[14px] px-2 py-1"
                  >
                    Profile
                  </Link>
                  <p
                    onClick={handleLogout}
                    className="text-[#D35451] text-[14px] px-2 py-1 cursor-pointer"
                  >
                    Log Out
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <Link href="/login" className={styles.login_link}>
              <div className={styles.login_button}>Login</div>
            </Link>
            <Link href="/signup" className={styles.signup_link}>
              <div className={styles.signup_button}>Sign Up</div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
