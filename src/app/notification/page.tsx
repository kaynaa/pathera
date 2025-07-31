"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
// Import fungsi-fungsi Firestore
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";

// Tipe data notifikasi dari Firestore
interface Notification {
  id: string;
  message: string;
  link: string;
  timestamp: Date;
  isRead: boolean;
}

// Fungsi format waktu tetap sama
const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 0) return "baru saja"; // Menangani perbedaan waktu kecil

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " tahun yang lalu";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " bulan yang lalu";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " hari yang lalu";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " jam yang lalu";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " menit yang lalu";
  return Math.floor(seconds) + " detik yang lalu";
};

export default function NotificationPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Query untuk mengambil notifikasi milik user yang sedang login, diurutkan dari yang terbaru
        const notificationsRef = collection(
          db,
          "users",
          user.uid,
          "notifications"
        );
        const q = query(notificationsRef, orderBy("timestamp", "desc"));

        const querySnapshot = await getDocs(q);
        const fetchedNotifications = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            message: data.message,
            link: data.link,
            // Konversi Firestore Timestamp ke Javascript Date
            timestamp: (data.timestamp as Timestamp).toDate(),
            isRead: data.isRead,
          };
        });

        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [user]); // Jalankan setiap kali user berubah

  return (
    <div>
      <Header pageName="" />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Notifikasi</h1>
          <div className={styles.notificationList}>
            {isLoading ? (
              <p className={styles.loadingText}>Memuat notifikasi...</p>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                <Link
                  key={notif.id}
                  href={notif.link}
                  className={styles.notificationItem}
                >
                  <div className={styles.content}>
                    <p className={styles.message}>{notif.message}</p>
                    <div className={styles.timeWrapper}>
                      <Clock className={styles.clockIcon} size={14} />
                      <span className={styles.time}>
                        {formatTimeAgo(notif.timestamp)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={styles.chevron} size={20} />
                </Link>
              ))
            ) : (
              <p className={styles.loadingText}>Tidak ada notifikasi.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
