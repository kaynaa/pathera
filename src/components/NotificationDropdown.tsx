// src/components/NotificationDropdown.tsx
import React from "react";
import Link from "next/link";
import styles from "./NotificationDropdown.module.css";
import { Notification } from "./Header"; // Impor tipe data dari Header
import { Timestamp } from "firebase/firestore"; // Impor Timestamp

interface NotificationDropdownProps {
  notifications: Notification[];
}

// Fungsi untuk membuat waktu dinamis (misal: "5 jam yang lalu")
const formatTimeAgo = (timestamp: Timestamp): string => {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `beberapa detik yang lalu`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit yang lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam yang lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari yang lalu`;
};

const NotificationDropdown = ({ notifications }: NotificationDropdownProps) => {
  return (
    <div className={styles.dropdownContainer}>
      <ul className={styles.notificationList}>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <li key={notif.id} className={styles.notificationItem}>
              <Link href={notif.link} className={styles.notificationLink}>
                {/* ▼▼▼ MULAI PERUBAHAN TAMPILAN ▼▼▼ */}
                <div className={styles.message}>{notif.message}</div>
                <div className={styles.time}>
                  {formatTimeAgo(notif.timestamp)}
                </div>
                {/* ▲▲▲ AKHIR PERUBAHAN TAMPILAN ▲▲▲ */}
              </Link>
            </li>
          ))
        ) : (
          <li className={styles.noNotification}>Tidak ada notifikasi baru.</li>
        )}
      </ul>
      <div className={styles.footer}>
        <Link href="/notification" className={styles.viewAllLink}>
          Lihat Semua Notifikasi
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
