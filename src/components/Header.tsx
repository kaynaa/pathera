// src/components/Header.tsx
"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { Bell, CircleUserRound, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
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
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (user) {
      const notificationsRef = collection(
        db,
        "users",
        user.uid,
        "notifications"
      );
      // ▼▼▼ UBAH LIMIT MENJADI 2 ▼▼▼
      const q = query(notificationsRef, orderBy("timestamp", "desc"), limit(2));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedNotifications = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Notification)
        );
        setNotifications(fetchedNotifications);
      });

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }
  const isLoggedIn = !!user;

  const toggleNotification = () => {
    setNotificationOpen((prev) => !prev);
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

    <div className={styles.right_container}>
        {isLoggedIn ? (
        <>
            <div className={styles.right_container}>
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
              <Link href="/profile">
                <CircleUserRound size={25} />
              </Link>
              <Link href="/profile" className={styles.username_display}>
                {userData?.fullName || "User"}
                <ChevronDown size={25} />
              </Link>
            </div>
          </>
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
